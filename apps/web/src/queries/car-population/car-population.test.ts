import { describe, expect, it } from "vitest";
import {
  cacheLifeMock,
  cacheTagMock,
  queueSelect,
  queueSelectDistinct,
  resetDbMocks,
} from "../test-utils";
import { getCarPopulationYears } from "./available-years";
import { getCarPopulationByYearAndMake } from "./by-year-and-make";
import { getCarPopulationYearlyTotals } from "./yearly-totals";

describe("car population queries", () => {
  beforeEach(() => {
    resetDbMocks();
  });

  describe("getCarPopulationYears", () => {
    it("should return distinct years in descending order", async () => {
      queueSelectDistinct([{ year: "2025" }, { year: "2024" }]);

      const result = await getCarPopulationYears();

      expect(result).toEqual([{ year: "2025" }, { year: "2024" }]);
      expect(cacheLifeMock).toHaveBeenCalledWith("max");
      expect(cacheTagMock).toHaveBeenCalledWith("cars:population:years");
    });

    it("should return empty array when no data exists", async () => {
      queueSelectDistinct([]);

      const result = await getCarPopulationYears();

      expect(result).toEqual([]);
    });
  });

  describe("getCarPopulationYearlyTotals", () => {
    it("should return yearly totals aggregated by year", async () => {
      queueSelect([
        { year: "2025", total: 662441 },
        { year: "2024", total: 600000 },
      ]);

      const result = await getCarPopulationYearlyTotals();

      expect(result).toEqual([
        { year: "2025", total: 662441 },
        { year: "2024", total: 600000 },
      ]);
      expect(cacheLifeMock).toHaveBeenCalledWith("max");
      expect(cacheTagMock).toHaveBeenCalledWith("cars:population:totals");
    });
  });

  describe("getCarPopulationByYearAndMake", () => {
    it("should return population grouped by year and make", async () => {
      queueSelect([
        { year: "2025", make: "TOYOTA", total: 138119 },
        { year: "2025", make: "BMW", total: 60000 },
      ]);

      const result = await getCarPopulationByYearAndMake();

      expect(result).toEqual([
        { year: "2025", make: "TOYOTA", total: 138119 },
        { year: "2025", make: "BMW", total: 60000 },
      ]);
      expect(cacheLifeMock).toHaveBeenCalledWith("max");
      expect(cacheTagMock).toHaveBeenCalledWith("cars:population:totals");
    });
  });
});
