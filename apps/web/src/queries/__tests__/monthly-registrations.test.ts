import { describe, expect, it } from "vitest";
import { getCarsComparison, getCarsData } from "../cars/monthly-registrations";
import {
  cacheLifeMock,
  cacheTagMock,
  queueBatch,
  resetDbMocks,
} from "./test-utils";

describe("monthly registration queries", () => {
  beforeEach(() => {
    resetDbMocks();
  });

  it("aggregates monthly registrations by fuel and vehicle type", async () => {
    // db.batch returns array of results for all queries
    queueBatch([
      [
        { name: "Electric", count: 10 },
        { name: "Hybrid", count: 2 },
      ],
      [{ name: "SUV", count: 5 }],
      [{ total: 12 }],
    ]);

    const result = await getCarsData("2024-06");

    expect(result).toEqual({
      month: "2024-06",
      total: 12,
      fuelType: [
        { name: "Electric", count: 10 },
        { name: "Hybrid", count: 2 },
      ],
      vehicleType: [{ name: "SUV", count: 5 }],
    });
    expect(cacheLifeMock).toHaveBeenCalledWith("max");
    expect(cacheTagMock).toHaveBeenCalledWith("cars:month:2024-06");
  });

  it("provides comparisons for previous month and year", async () => {
    // db.batch returns array of 9 results (3 months × 3 query types)
    queueBatch([
      [{ label: "Electric", count: 8 }], // currentMonth fuelType
      [{ label: "SUV", count: 6 }], // currentMonth vehicleType
      [{ total: 8 }], // currentMonth total
      [{ label: "Petrol", count: 3 }], // previousMonth fuelType
      [{ label: "Sedan", count: 4 }], // previousMonth vehicleType
      [{ total: 3 }], // previousMonth total
      [], // previousYear fuelType
      [], // previousYear vehicleType
      [{ total: 0 }], // previousYear total
    ]);

    const result = await getCarsComparison("2024-06");

    expect(result.currentMonth).toEqual({
      period: "2024-06",
      total: 8,
      fuelType: [{ label: "Electric", count: 8 }],
      vehicleType: [{ label: "SUV", count: 6 }],
    });
    expect(result.previousMonth).toEqual({
      period: "2024-05",
      total: 3,
      fuelType: [{ label: "Petrol", count: 3 }],
      vehicleType: [{ label: "Sedan", count: 4 }],
    });
    expect(result.previousYear).toEqual({
      period: "2023-06",
      total: 0,
      fuelType: [],
      vehicleType: [],
    });
    expect(cacheTagMock).toHaveBeenCalledWith("cars:month:2024-06");
  });
});
