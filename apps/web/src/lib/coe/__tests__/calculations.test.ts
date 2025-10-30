import type { COEResult } from "@web/types";
import { describe, expect, it } from "vitest";
import { groupCOEResultsByBidding } from "../calculations";

describe("COE Calculations", () => {
  describe("groupCOEResultsByBidding", () => {
    it("should group COE results by month and bidding number", () => {
      const mockResults: COEResult[] = [
        {
          month: "2024-01",
          bidding_no: 1,
          vehicle_class: "Category A",
          quota: 100,
          bids_success: 95,
          bids_received: 150,
          premium: 90000,
        },
        {
          month: "2024-01",
          bidding_no: 1,
          vehicle_class: "Category B",
          quota: 80,
          bids_success: 75,
          bids_received: 120,
          premium: 100000,
        },
        {
          month: "2024-01",
          bidding_no: 1,
          vehicle_class: "Category C",
          quota: 50,
          bids_success: 48,
          bids_received: 60,
          premium: 70000,
        },
      ];

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
        {
          month: "2024-01",
          bidding_no: 1,
          vehicle_class: "Category A",
          quota: 100,
          bids_success: 95,
          bids_received: 150,
          premium: 90000,
        },
        {
          month: "2024-01",
          bidding_no: 2,
          vehicle_class: "Category A",
          quota: 100,
          bids_success: 90,
          bids_received: 140,
          premium: 95000,
        },
        {
          month: "2024-02",
          bidding_no: 1,
          vehicle_class: "Category A",
          quota: 110,
          bids_success: 100,
          bids_received: 160,
          premium: 92000,
        },
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
      const mockResults: COEResult[] = [
        {
          month: "2024-01",
          bidding_no: 1,
          vehicle_class: "Category A",
          quota: 100,
          bids_success: 95,
          bids_received: 150,
          premium: 90000,
        },
        {
          month: "2024-01",
          bidding_no: 1,
          vehicle_class: "Category B",
          quota: 80,
          bids_success: 75,
          bids_received: 120,
          premium: 100000,
        },
        {
          month: "2024-01",
          bidding_no: 1,
          vehicle_class: "Category C",
          quota: 50,
          bids_success: 48,
          bids_received: 60,
          premium: 70000,
        },
        {
          month: "2024-01",
          bidding_no: 1,
          vehicle_class: "Category D",
          quota: 200,
          bids_success: 190,
          bids_received: 250,
          premium: 15000,
        },
        {
          month: "2024-01",
          bidding_no: 1,
          vehicle_class: "Category E",
          quota: 50,
          bids_success: 48,
          bids_received: 80,
          premium: 105000,
        },
      ];

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
        {
          month: "2024-02",
          bidding_no: 1,
          vehicle_class: "Category B",
          quota: 80,
          bids_success: 75,
          bids_received: 120,
          premium: 102000,
        },
        {
          month: "2024-01",
          bidding_no: 1,
          vehicle_class: "Category A",
          quota: 100,
          bids_success: 95,
          bids_received: 150,
          premium: 90000,
        },
        {
          month: "2024-01",
          bidding_no: 1,
          vehicle_class: "Category B",
          quota: 80,
          bids_success: 75,
          bids_received: 120,
          premium: 100000,
        },
        {
          month: "2024-02",
          bidding_no: 1,
          vehicle_class: "Category A",
          quota: 110,
          bids_success: 100,
          bids_received: 160,
          premium: 92000,
        },
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
