import type { COECategory, COEResult } from "@web/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  calculatePremiumRangeStats,
  groupCOEResultsByBidding,
} from "../calculations";

const createMockCOEResult = (overrides?: Partial<COEResult>): COEResult => ({
  month: "2024-01",
  biddingNo: 1,
  vehicleClass: "Category A",
  quota: 100,
  bidsSuccess: 95,
  bidsReceived: 150,
  premium: 90000,
  ...overrides,
});

const createCategoryResults = (
  month: string,
  biddingNo: number,
  categories: Array<{ class: COECategory; quota: number; premium: number }>,
): COEResult[] => {
  return categories.map(({ class: vehicleClass, quota, premium }) =>
    createMockCOEResult({
      month,
      biddingNo: biddingNo,
      vehicleClass: vehicleClass,
      quota,
      premium,
    }),
  );
};

describe("COE Calculations", () => {
  describe("groupCOEResultsByBidding", () => {
    it("should group COE results by month and bidding number", () => {
      const mockResults = createCategoryResults("2024-01", 1, [
        { class: "Category A", quota: 100, premium: 90000 },
        { class: "Category B", quota: 80, premium: 100000 },
        { class: "Category C", quota: 50, premium: 70000 },
      ]);

      const result = groupCOEResultsByBidding(mockResults);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        month: "2024-01",
        biddingNo: 1,
        "Category A": 90000,
        "Category B": 100000,
        "Category C": 70000,
      });
    });

    it("should handle multiple months and bidding numbers", () => {
      const mockResults: COEResult[] = [
        createMockCOEResult({
          month: "2024-01",
          biddingNo: 1,
          premium: 90000,
        }),
        createMockCOEResult({
          month: "2024-01",
          biddingNo: 2,
          premium: 95000,
        }),
        createMockCOEResult({
          month: "2024-02",
          biddingNo: 1,
          quota: 110,
          premium: 92000,
        }),
      ];

      const result = groupCOEResultsByBidding(mockResults);

      expect(result).toHaveLength(3);
      expect(result).toContainEqual({
        month: "2024-01",
        biddingNo: 1,
        "Category A": 90000,
      });
      expect(result).toContainEqual({
        month: "2024-01",
        biddingNo: 2,
        "Category A": 95000,
      });
      expect(result).toContainEqual({
        month: "2024-02",
        biddingNo: 1,
        "Category A": 92000,
      });
    });

    it("should group all five COE categories correctly", () => {
      const mockResults = createCategoryResults("2024-01", 1, [
        { class: "Category A", quota: 100, premium: 90000 },
        { class: "Category B", quota: 80, premium: 100000 },
        { class: "Category C", quota: 50, premium: 70000 },
        { class: "Category D", quota: 200, premium: 15000 },
        { class: "Category E", quota: 50, premium: 105000 },
      ]);

      const result = groupCOEResultsByBidding(mockResults);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        month: "2024-01",
        biddingNo: 1,
        "Category A": 90000,
        "Category B": 100000,
        "Category C": 70000,
        "Category D": 15000,
        "Category E": 105000,
      });
    });

    it("should handle empty array", () => {
      const result = groupCOEResultsByBidding([]);

      expect(result).toEqual([]);
    });

    it("should maintain grouping with mixed order input", () => {
      const mockResults: COEResult[] = [
        createMockCOEResult({
          month: "2024-02",
          vehicleClass: "Category B",
          quota: 80,
          premium: 102000,
        }),
        createMockCOEResult({
          month: "2024-01",
          vehicleClass: "Category A",
          premium: 90000,
        }),
        createMockCOEResult({
          month: "2024-01",
          vehicleClass: "Category B",
          quota: 80,
          premium: 100000,
        }),
        createMockCOEResult({
          month: "2024-02",
          vehicleClass: "Category A",
          quota: 110,
          premium: 92000,
        }),
      ];

      const result = groupCOEResultsByBidding(mockResults);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        month: "2024-01",
        biddingNo: 1,
        "Category A": 90000,
        "Category B": 100000,
      });
      expect(result).toContainEqual({
        month: "2024-02",
        biddingNo: 1,
        "Category A": 92000,
        "Category B": 102000,
      });
    });
  });

  describe("calculatePremiumRangeStats", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-06-15"));
    });

    it("should calculate YTD and all-time premium ranges for categories", () => {
      const mockResults: COEResult[] = [
        // Historical data (2024)
        createMockCOEResult({
          month: "2024-01",
          vehicleClass: "Category A",
          premium: 80000,
        }),
        createMockCOEResult({
          month: "2024-06",
          vehicleClass: "Category A",
          premium: 95000,
        }),
        // YTD data (2025)
        createMockCOEResult({
          month: "2025-01",
          vehicleClass: "Category A",
          premium: 88000,
        }),
        createMockCOEResult({
          month: "2025-03",
          vehicleClass: "Category A",
          premium: 92000,
        }),
        createMockCOEResult({
          month: "2025-05",
          vehicleClass: "Category A",
          premium: 85000,
        }),
      ];

      const result = calculatePremiumRangeStats(mockResults, ["Category A"]);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        category: "Category A",
        ytd: {
          highest: 92000,
          lowest: 85000,
          highestDate: "2025-03",
          lowestDate: "2025-05",
        },
        allTime: {
          highest: 95000,
          lowest: 80000,
          highestDate: "2024-06",
          lowestDate: "2024-01",
        },
      });
    });

    it("should return null YTD when no data exists for current year", () => {
      const mockResults: COEResult[] = [
        createMockCOEResult({
          month: "2024-01",
          vehicleClass: "Category A",
          premium: 80000,
        }),
        createMockCOEResult({
          month: "2024-12",
          vehicleClass: "Category A",
          premium: 95000,
        }),
      ];

      const result = calculatePremiumRangeStats(mockResults, ["Category A"]);

      expect(result).toHaveLength(1);
      expect(result[0]?.ytd).toBeNull();
      expect(result[0]?.allTime).toEqual({
        highest: 95000,
        lowest: 80000,
        highestDate: "2024-12",
        lowestDate: "2024-01",
      });
    });

    it("should handle multiple categories", () => {
      const mockResults: COEResult[] = [
        createMockCOEResult({
          month: "2025-01",
          vehicleClass: "Category A",
          premium: 90000,
        }),
        createMockCOEResult({
          month: "2025-02",
          vehicleClass: "Category A",
          premium: 85000,
        }),
        createMockCOEResult({
          month: "2025-01",
          vehicleClass: "Category B",
          premium: 100000,
        }),
        createMockCOEResult({
          month: "2025-02",
          vehicleClass: "Category B",
          premium: 110000,
        }),
      ];

      const result = calculatePremiumRangeStats(mockResults, [
        "Category A",
        "Category B",
      ]);

      expect(result).toHaveLength(2);

      const categoryA = result.find((r) => r.category === "Category A");
      expect(categoryA?.ytd?.highest).toBe(90000);
      expect(categoryA?.ytd?.lowest).toBe(85000);

      const categoryB = result.find((r) => r.category === "Category B");
      expect(categoryB?.ytd?.highest).toBe(110000);
      expect(categoryB?.ytd?.lowest).toBe(100000);
    });

    it("should filter out categories with no data", () => {
      const mockResults: COEResult[] = [
        createMockCOEResult({
          month: "2025-01",
          vehicleClass: "Category A",
          premium: 90000,
        }),
      ];

      const result = calculatePremiumRangeStats(mockResults, [
        "Category A",
        "Category B",
        "Category C",
      ]);

      expect(result).toHaveLength(1);
      expect(result[0]?.category).toBe("Category A");
    });

    it("should handle empty results array", () => {
      const result = calculatePremiumRangeStats([], ["Category A"]);

      expect(result).toEqual([]);
    });

    it("should handle single data point for YTD", () => {
      const mockResults: COEResult[] = [
        createMockCOEResult({
          month: "2025-03",
          vehicleClass: "Category A",
          premium: 90000,
        }),
      ];

      const result = calculatePremiumRangeStats(mockResults, ["Category A"]);

      expect(result).toHaveLength(1);
      expect(result[0]?.ytd).toEqual({
        highest: 90000,
        lowest: 90000,
        highestDate: "2025-03",
        lowestDate: "2025-03",
      });
      expect(result[0]?.allTime).toEqual({
        highest: 90000,
        lowest: 90000,
        highestDate: "2025-03",
        lowestDate: "2025-03",
      });
    });
  });
});
