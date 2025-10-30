import { redis } from "@sgcarstrends/utils";
import { LAST_UPDATED_CARS_KEY } from "@web/config";
import {
  checkMakeIfExist,
  getDistinctMakes,
  getMakeDetails,
} from "@web/lib/cars/queries";
import type { Car } from "@web/types";

export const fetchMakePageData = async (make: string, month?: string) => {
  const [makeExists, makeDetails, makesResult, lastUpdated] = await Promise.all(
    [
      checkMakeIfExist(make),
      getMakeDetails(make, month),
      getDistinctMakes(),
      redis.get<number>(LAST_UPDATED_CARS_KEY),
    ],
  );

  const makeName = makeExists?.make ?? make.toUpperCase();
  const makes = makesResult.map((m) => m.make);

  const cars = {
    make: makeName,
    total: makeDetails.total,
    data: makeDetails.data.map(
      (d): Car => ({
        month: d.month,
        make: makeName,
        fuel_type: d.fuelType as Car["fuel_type"],
        vehicle_type: d.vehicleType as Car["vehicle_type"],
        number: d.count,
      }),
    ),
  };

  return { cars, makes, lastUpdated, makeName };
};
