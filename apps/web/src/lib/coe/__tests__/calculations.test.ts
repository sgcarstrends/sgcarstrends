import type { COECategory, COEResult } from "@web/types";
import { describe, expect, it } from "vitest";
import { groupCOEResultsByBidding } from "../calculations";

const createMockCOEResult = (overrides?: Partial<COEResult>): COEResult => ({
  month: "2024-01",
  bidding_no: 1,
  vehicle_class: "Category A",
  quota: 100,
  bids_success: 95,
  bids_received: 150,
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
      bidding_no: biddingNo,
      vehicle_class: vehicleClass,
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
          bidding_no: 1,
          premium: 90000,
        }),
        createMockCOEResult({
          month: "2024-01",
          bidding_no: 2,
          premium: 95000,
        }),
        createMockCOEResult({
          month: "2024-02",
          bidding_no: 1,
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
          vehicle_class: "Category B",
          quota: 80,
          premium: 102000,
        }),
        createMockCOEResult({
          month: "2024-01",
          vehicle_class: "Category A",
          premium: 90000,
        }),
        createMockCOEResult({
          month: "2024-01",
          vehicle_class: "Category B",
          quota: 80,
          premium: 100000,
        }),
        createMockCOEResult({
          month: "2024-02",
          vehicle_class: "Category A",
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
});
