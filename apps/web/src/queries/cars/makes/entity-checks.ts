import { cars, db, ilike } from "@sgcarstrends/database";
import { cacheLife, cacheTag } from "next/cache";

function normalisePattern(input: string) {
  return input.replaceAll("-", "%");
}

export async function checkMakeIfExist(
  make: string,
): Promise<{ make: string } | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag(`cars:make:${make}`);

  const result = await db.query.cars.findFirst({
    where: ilike(cars.make, make),
    columns: { make: true },
  });

  return result;
}

export async function checkFuelTypeIfExist(
  fuelType: string,
): Promise<{ fuelType: string } | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag(`cars:fuel:${fuelType}`);

  const result = await db.query.cars.findFirst({
    where: ilike(cars.fuelType, normalisePattern(fuelType)),
    columns: { fuelType: true },
  });

  return result;
}

export async function checkVehicleTypeIfExist(
  vehicleType: string,
): Promise<{ vehicleType: string } | undefined> {
  "use cache";
  cacheLife("max");
  cacheTag(`cars:vehicle:${vehicleType}`);

  const result = await db.query.cars.findFirst({
    where: ilike(cars.vehicleType, normalisePattern(vehicleType)),
    columns: { vehicleType: true },
  });

  return result;
}
