import { cars, db } from "@sgcarstrends/database";
import { CACHE_TAG } from "@web/lib/cache";
import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export const getDistinctMakes = async () => {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAG.CARS);

  return db.selectDistinct({ make: cars.make }).from(cars).orderBy(cars.make);
};

export const getDistinctFuelTypes = async (
  month?: string,
): Promise<{ fuelType: string }[]> => {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAG.CARS);

  const filters = [];

  if (month) {
    filters.push(eq(cars.month, month));
  }

  return db
    .selectDistinct({ fuelType: cars.fuelType })
    .from(cars)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(cars.fuelType);
};

export const getDistinctVehicleTypes = async (
  month?: string,
): Promise<{ vehicleType: string }[]> => {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAG.CARS);

  const filters = [];

  if (month) {
    filters.push(eq(cars.month, month));
  }

  return db
    .selectDistinct({ vehicleType: cars.vehicleType })
    .from(cars)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(cars.vehicleType);
};

export const getCarsMonths = async (): Promise<{ month: string }[]> => {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAG.CARS);

  return db
    .selectDistinct({ month: cars.month })
    .from(cars)
    .orderBy(desc(cars.month));
};
