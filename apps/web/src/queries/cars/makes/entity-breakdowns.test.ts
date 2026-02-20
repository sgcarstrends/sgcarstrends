import { beforeEach, describe, expect, it } from "vitest";
import { queueSelect, resetDbMocks } from "../../test-utils";
import {
  getMakeFuelTypeBreakdown,
  getMakeVehicleTypeBreakdown,
} from "./entity-breakdowns";

describe("entity-breakdowns queries", () => {
  beforeEach(() => {
    resetDbMocks();
  });

  describe("getMakeFuelTypeBreakdown", () => {
    it("should return fuel type breakdown without month filter", async () => {
      queueSelect([
        { name: "Petrol", value: 500 },
        { name: "Electric", value: 300 },
      ]);

      const result = await getMakeFuelTypeBreakdown("TOYOTA");

      expect(result).toEqual([
        { name: "Petrol", value: 500 },
        { name: "Electric", value: 300 },
      ]);
    });

    it("should return fuel type breakdown with month filter", async () => {
      queueSelect([{ name: "Hybrid", value: 200 }]);

      const result = await getMakeFuelTypeBreakdown("TOYOTA", "2024-01");

      expect(result).toEqual([{ name: "Hybrid", value: 200 }]);
    });

    it("should filter out rows with null fuel type name", async () => {
      queueSelect([
        { name: "Petrol", value: 500 },
        { name: null, value: 100 },
        { name: "Electric", value: 300 },
      ]);

      const result = await getMakeFuelTypeBreakdown("TOYOTA");

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { name: "Petrol", value: 500 },
        { name: "Electric", value: 300 },
      ]);
    });

    it("should return empty array when no data exists", async () => {
      queueSelect([]);

      const result = await getMakeFuelTypeBreakdown("NONEXISTENT");

      expect(result).toEqual([]);
    });
  });

  describe("getMakeVehicleTypeBreakdown", () => {
    it("should return vehicle type breakdown without month filter", async () => {
      queueSelect([
        { name: "Saloon", value: 400 },
        { name: "SUV", value: 200 },
      ]);

      const result = await getMakeVehicleTypeBreakdown("BMW");

      expect(result).toEqual([
        { name: "Saloon", value: 400 },
        { name: "SUV", value: 200 },
      ]);
    });

    it("should return vehicle type breakdown with month filter", async () => {
      queueSelect([{ name: "Hatchback", value: 150 }]);

      const result = await getMakeVehicleTypeBreakdown("BMW", "2024-01");

      expect(result).toEqual([{ name: "Hatchback", value: 150 }]);
    });

    it("should filter out rows with null vehicle type name", async () => {
      queueSelect([
        { name: "Saloon", value: 400 },
        { name: null, value: 50 },
      ]);

      const result = await getMakeVehicleTypeBreakdown("BMW");

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Saloon");
    });

    it("should return empty array when no data exists", async () => {
      queueSelect([]);

      const result = await getMakeVehicleTypeBreakdown("NONEXISTENT");

      expect(result).toEqual([]);
    });
  });
});
