import { cars, db } from "@sgcarstrends/database";
import { sql } from "drizzle-orm";

const normalisePattern = (value: string) => value.replaceAll("-", "%");

export const checkMakeIfExist = async (
  make: string,
): Promise<{ make: string } | undefined> => {
  const result = await db.query.cars.findFirst({
    where: sql`lower(${cars.make}) LIKE lower(${normalisePattern(make)})`,
    columns: { make: true },
  });

  return result ? { make: result.make ?? "Unknown" } : undefined;
};

export const checkFuelTypeIfExist = async (
  fuelType: string,
): Promise<{ fuelType: string } | undefined> => {
  const result = await db.query.cars.findFirst({
    where: sql`lower(${cars.fuelType}) LIKE lower(${normalisePattern(fuelType)})`,
    columns: { fuelType: true },
  });

  return result ? { fuelType: result.fuelType ?? "Unknown" } : undefined;
};

export const checkVehicleTypeIfExist = async (
  vehicleType: string,
): Promise<{ vehicleType: string } | undefined> => {
  const result = await db.query.cars.findFirst({
    where: sql`lower(${cars.vehicleType}) LIKE lower(${normalisePattern(vehicleType)})`,
    columns: { vehicleType: true },
  });

  return result ? { vehicleType: result.vehicleType ?? "Unknown" } : undefined;
};
