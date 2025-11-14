import { CACHE_LIFE, CACHE_TAG } from "@web/lib/cache";
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

  it("returns distinct fuel types with month filtering", async () => {
    queueSelectDistinct([
      { fuelType: "Electric" },
      { fuelType: "Hybrid" },
      { fuelType: "Petrol" },
    ]);

    const result = await getDistinctFuelTypes("2024-04");

    expect(result).toEqual([
      { fuelType: "Electric" },
      { fuelType: "Hybrid" },
      { fuelType: "Petrol" },
    ]);
  });

  it("returns distinct fuel types without month filter", async () => {
    queueSelectDistinct([{ fuelType: "Electric" }, { fuelType: "Diesel" }]);

    const result = await getDistinctFuelTypes();

    expect(result).toEqual([{ fuelType: "Electric" }, { fuelType: "Diesel" }]);
  });

  it("returns distinct vehicle types with month filtering", async () => {
    queueSelectDistinct([
      { vehicleType: "Cars" },
      { vehicleType: "Motor cycles" },
    ]);

    const result = await getDistinctVehicleTypes("2024-01");

    expect(result).toEqual([
      { vehicleType: "Cars" },
      { vehicleType: "Motor cycles" },
    ]);
  });

  it("returns distinct months and registers cache metadata", async () => {
    queueSelectDistinct([{ month: "2024-06" }, { month: "2024-05" }]);

    const result = await getCarsMonths();

    expect(result).toEqual([{ month: "2024-06" }, { month: "2024-05" }]);
    expect(cacheLifeMock).toHaveBeenCalledWith(CACHE_LIFE.statistics);
    expect(cacheTagMock).toHaveBeenCalledWith(...CACHE_TAG.cars.months());
  });
});
