import { getTrailingSixMonths } from "@sgcarstrends/utils";
import { describe, expect, it } from "vitest";

describe("getTrailingSixMonths", () => {
  // Basic functionality tests
  describe("Standard date inputs", () => {
    it("should return correct trailing 6 months start date for mid-year input", () => {
      expect(getTrailingSixMonths("2023-07")).toBe("2023-02");
    });

    it("should return correct trailing 6 months start date for year-end", () => {
      expect(getTrailingSixMonths("2023-12")).toBe("2023-07");
    });

    it("should return correct trailing 6 months start date for year-start", () => {
      expect(getTrailingSixMonths("2023-01")).toBe("2022-08");
    });
  });

  // Edge case tests
  describe("Edge cases", () => {
    it("should handle single-digit month inputs", () => {
      expect(getTrailingSixMonths("2023-03")).toBe("2022-10");
    });

    it("should handle year transitions correctly", () => {
      expect(getTrailingSixMonths("2024-01")).toBe("2023-08");
    });
  });

  // Leap year considerations
  describe("Leap year handling", () => {
    it("should work correctly across leap year boundaries", () => {
      expect(getTrailingSixMonths("2024-02")).toBe("2023-09");
    });
  });
});
