import {
  getCarsMonths,
  getDistinctFuelTypes,
  getDistinctMakes,
  getDistinctVehicleTypes,
} from "../cars/filter-options";
import {
  cacheLifeMock,
  cacheTagMock,
  queueSelectDistinct,
  resetDbMocks,
} from "./test-utils";

describe("car filter option queries", () => {
  beforeEach(() => {
    resetDbMocks();
  });

  it("returns distinct makes from the database", async () => {
    queueSelectDistinct([{ make: "Audi" }, { make: "Tesla" }]);

    await expect(getDistinctMakes()).resolves.toEqual([
      { make: "Audi" },
      { make: "Tesla" },
    ]);
  });

  it("normalises null fuel types and applies month filtering", async () => {
    queueSelectDistinct([
      { fuelType: "Electric" },
      { fuelType: null },
      { fuelType: "Hybrid" },
    ]);

    const result = await getDistinctFuelTypes("2024-04");

    expect(result).toEqual([
      { fuelType: "Electric" },
      { fuelType: "Unknown" },
      { fuelType: "Hybrid" },
    ]);
  });

  it("handles missing month when fetching distinct fuel types", async () => {
    queueSelectDistinct([{ fuelType: null }]);

    const result = await getDistinctFuelTypes();

    expect(result).toEqual([{ fuelType: "Unknown" }]);
  });

  it("maps vehicle types to Unknown when value is null", async () => {
    queueSelectDistinct([{ vehicleType: null }]);

    const result = await getDistinctVehicleTypes("2024-01");

    expect(result).toEqual([{ vehicleType: "Unknown" }]);
  });

  it("returns distinct months and registers cache metadata", async () => {
    queueSelectDistinct([{ month: "2024-06" }, { month: null }]);

    const result = await getCarsMonths();

    expect(result).toEqual([{ month: "2024-06" }, { month: "" }]);
    expect(cacheLifeMock).toHaveBeenCalledWith("statistics");
    expect(cacheTagMock).toHaveBeenCalledWith("cars", "cars-months");
  });
});
