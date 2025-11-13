import { describe, expect, it } from "vitest";
import { getCarsComparison, getCarsData } from "../cars/monthly-registrations";
import {
  cacheLifeMock,
  cacheTagMock,
  queueSelect,
  resetDbMocks,
} from "./test-utils";

describe("monthly registration queries", () => {
  beforeEach(() => {
    resetDbMocks();
  });

  it("aggregates monthly registrations by fuel and vehicle type", async () => {
    queueSelect(
      [
        { name: "Electric", count: 10 },
        { name: "Hybrid", count: 2 },
      ],
      [{ name: "SUV", count: 5 }],
      [{ total: 12 }],
    );

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
    expect(cacheLifeMock).toHaveBeenCalledWith("monthlyData");
    expect(cacheTagMock).toHaveBeenCalledWith("cars", "cars-2024-06");
  });

  it("provides comparisons for previous month and year", async () => {
    queueSelect(
      [{ label: "Electric", count: 8 }],
      [{ label: "SUV", count: 6 }],
      [{ total: 8 }],
      [{ label: "Petrol", count: 3 }],
      [{ label: "Sedan", count: 4 }],
      [{ total: 3 }],
      [],
      [],
      [{ total: 0 }],
    );

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
    expect(cacheTagMock).toHaveBeenCalledWith(
      "cars",
      "cars-comparison-2024-06",
    );
  });
});
