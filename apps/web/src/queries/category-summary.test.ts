import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCategorySummaryByYear } from "./cars/category-summary";
import {
  cacheLifeMock,
  cacheTagMock,
  queueSelect,
  resetDbMocks,
} from "./test-utils";

describe("category summary queries", () => {
  beforeEach(() => {
    resetDbMocks();
  });

  it("should return category summary for current year", async () => {
    // Queue: 1) latestYearSubquery builder, 2) main query result
    queueSelect(
      [],
      [{ year: 2024, total: 100000, electric: 15000, hybrid: 25000 }],
    );

    const result = await getCategorySummaryByYear();

    expect(result).toEqual({
      year: 2024,
      total: 100000,
      electric: 15000,
      hybrid: 25000,
    });
    expect(cacheLifeMock).toHaveBeenCalledWith("max");
    expect(cacheTagMock).toHaveBeenCalledWith(
      "cars:annual",
      "cars:fuel:electric",
      "cars:fuel:hybrid",
    );
  });

  it("should return category summary for explicit year", async () => {
    // Queue: 1) latestYearSubquery builder (created but not used), 2) main query result
    queueSelect(
      [],
      [{ year: 2023, total: 90000, electric: 10000, hybrid: 20000 }],
    );

    const result = await getCategorySummaryByYear(2023);

    expect(result).toEqual({
      year: 2023,
      total: 90000,
      electric: 10000,
      hybrid: 20000,
    });
    expect(cacheTagMock).toHaveBeenCalledWith("cars:year:2023");
  });

  it("should return default values when no data exists", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15"));

    // Queue: 1) latestYearSubquery builder, 2) main query (empty)
    queueSelect([], []);

    const result = await getCategorySummaryByYear();

    expect(result.year).toBe(2024);
    expect(result.total).toBe(0);
    expect(result.electric).toBe(0);
    expect(result.hybrid).toBe(0);

    vi.useRealTimers();
  });
});
