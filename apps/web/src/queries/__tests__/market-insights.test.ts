import { describe, expect, it, vi } from "vitest";
import {
  cacheLifeMock,
  cacheTagMock,
  queueBatch,
  queueSelect,
  resetDbMocks,
} from "./test-utils";

vi.mock("@web/queries", () => ({
  getCarsData: vi.fn(),
}));

import { getCarsData } from "@web/queries";
import * as marketInsights from "../cars/market-insights";

const mockedGetCarsData = vi.mocked(getCarsData);

describe("car market insight queries", () => {
  beforeEach(() => {
    resetDbMocks();
    mockedGetCarsData.mockReset();
  });

  it("returns the top fuel and vehicle types", async () => {
    // getTopTypes uses db.batch with 2 queries
    queueBatch([
      [{ name: "Electric", total: 60 }],
      [{ name: "SUV", total: 40 }],
    ]);

    const result = await marketInsights.getTopTypes("2024-04");

    expect(result).toEqual({
      month: "2024-04",
      topFuelType: { name: "Electric", total: 60 },
      topVehicleType: { name: "SUV", total: 40 },
    });
    expect(cacheLifeMock).toHaveBeenCalledWith("max");
    expect(cacheTagMock).toHaveBeenCalledWith("cars:month:2024-04");
  });

  it("falls back to placeholder entries when no types exist", async () => {
    queueBatch([[], []]);

    const result = await marketInsights.getTopTypes("2024-05");

    expect(result.topFuelType).toEqual({ name: "N/A", total: 0 });
    expect(result.topVehicleType).toEqual({ name: "N/A", total: 0 });
  });

  it("returns top makes for the month", async () => {
    queueSelect([{ make: "Toyota", total: 15 }]);

    const result = await marketInsights.getTopMakes("2024-05");

    expect(result).toEqual([{ make: "Toyota", total: 15 }]);
  });

  it("groups top makes for every fuel type", async () => {
    // First query (non-batched) fetches fuel type totals
    queueSelect([
      { fuelType: "Electric", total: 100 },
      { fuelType: "Hybrid", total: 20 },
    ]);
    // Then db.batch is called with queries for each fuel type
    queueBatch([
      [{ make: "Tesla", count: 80 }],
      [{ make: "Toyota", count: 20 }],
    ]);

    const result = await marketInsights.getTopMakesByFuelType("2024-06");

    expect(result).toEqual([
      {
        fuelType: "Electric",
        total: 100,
        makes: [{ make: "Tesla", count: 80 }],
      },
      {
        fuelType: "Hybrid",
        total: 20,
        makes: [{ make: "Toyota", count: 20 }],
      },
    ]);
    expect(cacheTagMock).toHaveBeenCalledWith("cars:month:2024-06");
  });

  it("computes market share breakdowns from cached data", async () => {
    mockedGetCarsData.mockResolvedValue({
      month: "2024-07",
      total: 100,
      fuelType: [
        { name: "Electric", count: 60 },
        { name: "Hybrid", count: 40 },
      ],
      vehicleType: [],
    });

    const result = await marketInsights.getCarMarketShareData(
      "2024-07",
      "fuelType",
    );

    expect(result).toMatchObject({
      month: "2024-07",
      total: 100,
      category: "fuelType",
      dominantType: { name: "Electric", percentage: 60 },
    });
    expect(result.data).toHaveLength(2);
  });

  it("creates top performer summaries from derived queries", async () => {
    queueSelect([], []);
    queueBatch([[{ name: "Hybrid", total: 40 }], [{ name: "SUV", total: 30 }]]);
    queueSelect([
      { make: "Toyota", total: 25 },
      { make: "Tesla", total: 15 },
    ]);

    mockedGetCarsData.mockResolvedValue({
      month: "2024-08",
      total: 100,
      fuelType: [],
      vehicleType: [],
    });

    const result = await marketInsights.getCarTopPerformersData("2024-08");

    expect(result).toEqual({
      month: "2024-08",
      total: 100,
      topFuelTypes: [{ name: "Hybrid", count: 40, percentage: 40, rank: 1 }],
      topVehicleTypes: [{ name: "SUV", count: 30, percentage: 30, rank: 1 }],
      topMakes: [
        { make: "Toyota", count: 25, percentage: 25, rank: 1 },
        { make: "Tesla", count: 15, percentage: 15, rank: 2 },
      ],
    });
  });
});
