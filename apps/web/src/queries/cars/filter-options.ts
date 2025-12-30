import { cars, db } from "@sgcarstrends/database";
import { and, desc, eq, gt, sql, sum } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function getDistinctMakes() {
  "use cache";
  cacheLife("max");
  cacheTag("cars:makes");

  return db.selectDistinct({ make: cars.make }).from(cars).orderBy(cars.make);
}

export async function getDistinctFuelTypes(
  month?: string,
): Promise<{ fuelType: string }[]> {
  "use cache";
  cacheLife("max");
  if (month) {
    cacheTag(`cars:month:${month}`);
  }

  const filters = [];

  if (month) {
    filters.push(eq(cars.month, month));
  }

  return db
    .select({ fuelType: cars.fuelType })
    .from(cars)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .groupBy(cars.fuelType)
    .having(gt(sum(cars.number), 0))
    .orderBy(cars.fuelType);
}

export async function getDistinctVehicleTypes(
  month?: string,
): Promise<{ vehicleType: string }[]> {
  "use cache";
  cacheLife("max");
  if (month) {
    cacheTag(`cars:month:${month}`);
  }

  const filters = [];

  if (month) {
    filters.push(eq(cars.month, month));
  }

  return db
    .select({ vehicleType: cars.vehicleType })
    .from(cars)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .groupBy(cars.vehicleType)
    .having(gt(sum(cars.number), 0))
    .orderBy(cars.vehicleType);
}

export async function getCarsMonths(): Promise<{ month: string }[]> {
  "use cache";
  cacheLife("max");
  cacheTag("cars:months");

  return db
    .selectDistinct({ month: cars.month })
    .from(cars)
    .orderBy(desc(cars.month));
}
