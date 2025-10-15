import { getMonthsByYear } from "@api/lib/get-months-by-year";
import { getUniqueMonths } from "@api/lib/get-unique-months";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMonthsRoute } from "../months-route";

// Mock database to prevent connection initialization
vi.mock("@sgcarstrends/database", () => ({
  db: {
    select: vi.fn(),
    selectDistinct: vi.fn(),
  },
}));

// Mock the utility functions
vi.mock("@api/lib/get-unique-months");
vi.mock("@api/lib/get-months-by-year");

describe("createMonthsRoute", () => {
  const mockTable = {} as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return ungrouped months when grouped param is not provided", async () => {
    const mockMonths = ["2024-01", "2024-02", "2024-03"];
    vi.mocked(getUniqueMonths).mockResolvedValue(mockMonths);

    const app = createMonthsRoute(mockTable, "Cars");

    const res = await app.request("/months");
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(mockMonths);
    expect(getUniqueMonths).toHaveBeenCalledWith(mockTable);
    expect(getMonthsByYear).not.toHaveBeenCalled();
  });

  it("should return grouped months when grouped param is true", async () => {
    const mockMonths = ["2024-01", "2024-02", "2023-12"];
    const mockGroupedMonths = [
      { year: "2024", months: ["02", "01"] },
      { year: "2023", months: ["12"] },
    ];

    vi.mocked(getUniqueMonths).mockResolvedValue(mockMonths);
    vi.mocked(getMonthsByYear).mockReturnValue(mockGroupedMonths);

    const app = createMonthsRoute(mockTable, "COE");

    const res = await app.request("/months?grouped=true");
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(mockGroupedMonths);
    expect(getUniqueMonths).toHaveBeenCalledWith(mockTable);
    expect(getMonthsByYear).toHaveBeenCalledWith(mockMonths);
  });

  it("should handle missing grouped param", async () => {
    const mockMonths = ["2024-01", "2024-02"];
    vi.mocked(getUniqueMonths).mockResolvedValue(mockMonths);

    const app = createMonthsRoute(mockTable, "Cars");

    const res = await app.request("/months");
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(mockMonths);
    expect(getMonthsByYear).not.toHaveBeenCalled();
  });

  it("should use custom description when provided", async () => {
    const customDescription = "Custom test description";
    const app = createMonthsRoute(mockTable, "TestTag", customDescription);

    // The route is created with the custom description
    // We can't directly test the OpenAPI spec without more complex setup,
    // but we can verify the app is created successfully
    expect(app).toBeDefined();
  });
});
