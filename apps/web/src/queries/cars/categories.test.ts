import { beforeEach, describe, expect, it } from "vitest";
import { queueSelect, queueSelectDistinct, resetDbMocks } from "../test-utils";
import {
  FUEL_TYPE,
  getDistinctTypes,
  getTopType,
  getTypeBreakdown,
  getTypeDistribution,
  getTypeTotal,
  VEHICLE_TYPE,
} from "./categories";

describe("categories queries", () => {
  beforeEach(() => {
    resetDbMocks();
  });

  describe("getTypeDistribution", () => {
    it("should return fuel type distribution for a month", async () => {
      queueSelect([
        { name: "Petrol", count: 5000 },
        { name: "Electric", count: 3000 },
        { name: "Hybrid", count: 2000 },
      ]);

      const result = await getTypeDistribution(FUEL_TYPE, "2024-01");

      expect(result).toEqual([
        { name: "Petrol", count: 5000 },
        { name: "Electric", count: 3000 },
        { name: "Hybrid", count: 2000 },
      ]);
    });

    it("should return vehicle type distribution for a month", async () => {
      queueSelect([
        { name: "Saloon", count: 4000 },
        { name: "SUV", count: 3500 },
      ]);

      const result = await getTypeDistribution(VEHICLE_TYPE, "2024-01");

      expect(result).toEqual([
        { name: "Saloon", count: 4000 },
        { name: "SUV", count: 3500 },
      ]);
    });

    it("should return empty array when no data for month", async () => {
      queueSelect([]);

      const result = await getTypeDistribution(FUEL_TYPE, "1999-01");

      expect(result).toEqual([]);
    });
  });

  describe("getTopType", () => {
    it("should return top fuel type with default limit of 1", async () => {
      queueSelect([{ name: "Petrol", total: 5000 }]);

      const result = await getTopType(FUEL_TYPE, "2024-01");

      expect(result).toEqual([{ name: "Petrol", total: 5000 }]);
    });

    it("should return top N vehicle types when limit specified", async () => {
      queueSelect([
        { name: "Saloon", total: 4000 },
        { name: "SUV", total: 3500 },
        { name: "Hatchback", total: 2000 },
      ]);

      const result = await getTopType(VEHICLE_TYPE, "2024-01", 3);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ name: "Saloon", total: 4000 });
    });
  });

  describe("getDistinctTypes", () => {
    it("should return all distinct fuel types without month filter", async () => {
      queueSelectDistinct([
        { value: "Diesel" },
        { value: "Electric" },
        { value: "Hybrid" },
        { value: "Petrol" },
      ]);

      const result = await getDistinctTypes(FUEL_TYPE);

      expect(result).toEqual([
        { value: "Diesel" },
        { value: "Electric" },
        { value: "Hybrid" },
        { value: "Petrol" },
      ]);
    });

    it("should return distinct vehicle types filtered by month", async () => {
      queueSelectDistinct([{ value: "Saloon" }, { value: "SUV" }]);

      const result = await getDistinctTypes(VEHICLE_TYPE, "2024-01");

      expect(result).toEqual([{ value: "Saloon" }, { value: "SUV" }]);
    });
  });

  describe("getTypeTotal", () => {
    it("should return total count for a fuel type", async () => {
      queueSelect([{ total: 15000 }]);

      const result = await getTypeTotal(FUEL_TYPE, "Petrol");

      expect(result).toEqual([{ total: 15000 }]);
    });

    it("should handle ILIKE pattern matching with hyphens replaced by wildcards", async () => {
      queueSelect([{ total: 8000 }]);

      // When typeValue contains hyphens, they're replaced with % for ILIKE
      const result = await getTypeTotal(FUEL_TYPE, "Battery-Electric");

      expect(result).toEqual([{ total: 8000 }]);
    });

    it("should filter by month when provided", async () => {
      queueSelect([{ total: 1000 }]);

      const result = await getTypeTotal(VEHICLE_TYPE, "SUV", "2024-03");

      expect(result).toEqual([{ total: 1000 }]);
    });
  });

  describe("getTypeBreakdown", () => {
    it("should return breakdown by month, make, and type", async () => {
      queueSelect([
        { month: "2024-01", make: "Toyota", type: "Hybrid", count: 500 },
        { month: "2024-01", make: "Honda", type: "Hybrid", count: 300 },
      ]);

      const result = await getTypeBreakdown(FUEL_TYPE, "Hybrid");

      expect(result).toEqual([
        { month: "2024-01", make: "Toyota", type: "Hybrid", count: 500 },
        { month: "2024-01", make: "Honda", type: "Hybrid", count: 300 },
      ]);
    });

    it("should handle ILIKE pattern with hyphens in vehicle type", async () => {
      queueSelect([
        { month: "2024-02", make: "BMW", type: "Sport Utility", count: 200 },
      ]);

      // Sport-Utility becomes Sport%Utility for ILIKE pattern
      const result = await getTypeBreakdown(VEHICLE_TYPE, "Sport-Utility");

      expect(result).toEqual([
        { month: "2024-02", make: "BMW", type: "Sport Utility", count: 200 },
      ]);
    });

    it("should filter by month when provided", async () => {
      queueSelect([
        { month: "2024-03", make: "Tesla", type: "Electric", count: 150 },
      ]);

      const result = await getTypeBreakdown(FUEL_TYPE, "Electric", "2024-03");

      expect(result).toEqual([
        { month: "2024-03", make: "Tesla", type: "Electric", count: 150 },
      ]);
    });

    it("should return empty array when no matching data", async () => {
      queueSelect([]);

      const result = await getTypeBreakdown(
        FUEL_TYPE,
        "NonExistentType",
        "2024-01",
      );

      expect(result).toEqual([]);
    });
  });

  describe("type configs", () => {
    it("should have correct FUEL_TYPE config", () => {
      expect(FUEL_TYPE.fieldName).toBe("fuelType");
    });

    it("should have correct VEHICLE_TYPE config", () => {
      expect(VEHICLE_TYPE.fieldName).toBe("vehicleType");
    });
  });
});
