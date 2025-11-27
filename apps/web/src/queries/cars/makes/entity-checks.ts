import { cars, db } from "@sgcarstrends/database";
import { CACHE_TAG } from "@web/lib/cache";
import { ilike } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

const normalisePattern = (value: string) => value.replaceAll("-", "%");

export const checkMakeIfExist = async (
  make: string,
): Promise<{ make: string } | undefined> => {
  const result = await db.query.cars.findFirst({
    where: ilike(cars.make, normalisePattern(make)),
    columns: { make: true },
  });

  return result;
};

export const checkFuelTypeIfExist = async (
  fuelType: string,
): Promise<{ fuelType: string } | undefined> => {
  const result = await db.query.cars.findFirst({
    where: ilike(cars.fuelType, normalisePattern(fuelType)),
    columns: { fuelType: true },
  });

  return result;
};

export const checkVehicleTypeIfExist = async (
  vehicleType: string,
): Promise<{ vehicleType: string } | undefined> => {
  const result = await db.query.cars.findFirst({
    where: ilike(cars.vehicleType, normalisePattern(vehicleType)),
    columns: { vehicleType: true },
  });

  return result;
};
