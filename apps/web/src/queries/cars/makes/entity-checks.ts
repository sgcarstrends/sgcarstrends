import { cars, db } from "@sgcarstrends/database";
import { sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

const normalisePattern = (value: string) => value.replaceAll("-", "%");

export const checkMakeIfExist = async (
  make: string,
): Promise<{ make: string } | undefined> => {
  "use cache";
  cacheLife("max");
  cacheTag("cars");

  const result = await db.query.cars.findFirst({
    where: sql`lower(${cars.make}) LIKE lower(${normalisePattern(make)})`,
    columns: { make: true },
  });

  return result;
};

export const checkFuelTypeIfExist = async (
  fuelType: string,
): Promise<{ fuelType: string } | undefined> => {
  "use cache";
  cacheLife("max");
  cacheTag("cars");

  const result = await db.query.cars.findFirst({
    where: sql`lower(${cars.fuelType}) LIKE lower(${normalisePattern(fuelType)})`,
    columns: { fuelType: true },
  });

  return result;
};

export const checkVehicleTypeIfExist = async (
  vehicleType: string,
): Promise<{ vehicleType: string } | undefined> => {
  "use cache";
  cacheLife("max");
  cacheTag("cars");

  const result = await db.query.cars.findFirst({
    where: sql`lower(${cars.vehicleType}) LIKE lower(${normalisePattern(vehicleType)})`,
    columns: { vehicleType: true },
  });

  return result;
};
