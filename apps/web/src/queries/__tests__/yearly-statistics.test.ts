import { CACHE_LIFE, CACHE_TAG } from "@web/lib/cache";
import { describe, expect, it } from "vitest";
import {
  getTopMakesByYear,
  getYearlyRegistrations,
} from "../cars/yearly-statistics";
import {
  cacheLifeMock,
  cacheTagMock,
  queueSelect,
  resetDbMocks,
} from "./test-utils";

describe("yearly statistics queries", () => {
  beforeEach(() => {
    resetDbMocks();
  });

  it("aggregates yearly registration totals", async () => {
    queueSelect([{ year: "2022", total: 123 }]);

    const result = await getYearlyRegistrations();

    expect(result).toEqual([{ year: 2022, total: 123 }]);
    expect(cacheLifeMock).toHaveBeenCalledWith(CACHE_LIFE.statistics);
    expect(cacheTagMock).toHaveBeenCalledWith(...CACHE_TAG.cars.statsYearly());
  });

  it("returns top makes for an explicit year", async () => {
    queueSelect([{ make: "Tesla", value: 50 }]);

    const result = await getTopMakesByYear(2024, 1);

    expect(result).toEqual([{ make: "Tesla", value: 50 }]);
    expect(cacheTagMock).toHaveBeenCalledWith(
      ...CACHE_TAG.cars.statsTopMakes("2024"),
    );
  });

  it("derives latest year when no year is supplied", async () => {
    queueSelect([{ year: "2021" }], [{ make: "Toyota", value: 80 }]);

    const result = await getTopMakesByYear();

    expect(result).toEqual([{ make: "Toyota", value: 80 }]);
  });

  it("returns an empty list when no data is present", async () => {
    queueSelect([]);

    const result = await getTopMakesByYear();

    expect(result).toEqual([]);
  });
});
