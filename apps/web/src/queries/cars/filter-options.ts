import { cars, db } from "@sgcarstrends/database";
import { and, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export const getDistinctMakes = () => {
  return db.selectDistinct({ make: cars.make }).from(cars).orderBy(cars.make);
};

export const getDistinctFuelTypes = async (
  month?: string,
): Promise<{ fuelType: string }[]> => {
  const filters = [];

  if (month) {
    filters.push(eq(cars.month, month));
  }

  const results = await db
    .selectDistinct({ fuelType: cars.fuelType })
    .from(cars)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(cars.fuelType);

  return results.map((r) => ({ fuelType: r.fuelType ?? "Unknown" }));
};

export const getDistinctVehicleTypes = async (
  month?: string,
): Promise<{ vehicleType: string }[]> => {
  const filters = [];

  if (month) {
    filters.push(eq(cars.month, month));
  }

  const results = await db
    .selectDistinct({ vehicleType: cars.vehicleType })
    .from(cars)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(cars.vehicleType);

  return results.map((r) => ({ vehicleType: r.vehicleType ?? "Unknown" }));
};

export const getCarsMonths = async (): Promise<{ month: string }[]> => {
  "use cache";
  cacheLife("statistics");
  cacheTag("cars", "cars-months");

  const results = await db
    .selectDistinct({ month: cars.month })
    .from(cars)
    .orderBy(desc(cars.month));

  return results.map((r) => ({ month: r.month ?? "" }));
};
