import { getLatestMonth } from "@api/lib/get-latest-month";
import { db } from "@sgcarstrends/database";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@sgcarstrends/database", () => ({
  db: {
    select: vi.fn(),
  },
}));

describe("getLatestMonth", () => {
  const mockTable = { month: "month" } as never;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return the latest month from the table", async () => {
    const mockMonth = "2023-12";

    const mockQueryBuilder = {
      from: vi.fn().mockResolvedValue([{ month: mockMonth }]),
    };

    vi.mocked(db.select).mockReturnValue(mockQueryBuilder as never);

    const result = await getLatestMonth(mockTable);

    expect(db.select).toHaveBeenCalled();
    expect(mockQueryBuilder.from).toHaveBeenCalled();
    expect(result).toBe(mockMonth);
  });

  it("should return null when no data is found", async () => {
    const mockQueryBuilder = {
      from: vi.fn().mockResolvedValue([{ month: null }]),
    };

    vi.mocked(db.select).mockReturnValue(mockQueryBuilder as never);

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await getLatestMonth(mockTable);

    expect(db.select).toHaveBeenCalled();
    expect(mockQueryBuilder.from).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    expect(result).toBeNull();

    consoleSpy.mockRestore();
  });

  it("should handle errors properly", async () => {
    const mockError = new Error("Database error");

    const mockQueryBuilder = {
      from: vi.fn().mockRejectedValue(mockError),
    };

    vi.mocked(db.select).mockReturnValue(mockQueryBuilder as never);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(getLatestMonth(mockTable)).rejects.toThrow(mockError);

    expect(db.select).toHaveBeenCalled();
    expect(mockQueryBuilder.from).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(mockError);

    consoleSpy.mockRestore();
  });
});
