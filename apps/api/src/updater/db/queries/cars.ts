import { db } from "@api/updater/db";
import { cars } from "@sgcarstrends/schema";
import { and, desc, eq, ne, sum } from "drizzle-orm";

export const getCarsLatestMonth = async () =>
  await db.query.cars.findFirst({
    columns: { month: true },
    orderBy: desc(cars.month),
  });

export const getCarRegistrationsByMonth = async (month: string) => {
  const whereConditions = [eq(cars.month, month), ne(cars.number, 0)];

  const [getByFuelType, getByVehicleType, totalRecords] = await db.batch([
    db
      .select({ fuelType: cars.fuel_type, total: sum(cars.number) })
      .from(cars)
      .where(and(...whereConditions))
      .groupBy(cars.fuel_type),
    db
      .select({ vehicleType: cars.vehicle_type, total: sum(cars.number) })
      .from(cars)
      .where(and(...whereConditions))
      .groupBy(cars.vehicle_type),
    db
      .select({ total: sum(cars.number) })
      .from(cars)
      .where(and(...whereConditions))
      .limit(1),
  ]);

  const fuelType = Object.fromEntries(
    getByFuelType.map(({ fuelType, total }) => [fuelType, Number(total)]),
  );

  const vehicleType = Object.fromEntries(
    getByVehicleType.map(({ vehicleType, total }) => [
      vehicleType,
      Number(total),
    ]),
  );

  const total = Number(totalRecords[0].total ?? 0);

  console.log({
    month,
    fuelType,
    vehicleType,
    total,
  });

  return { month, fuelType, vehicleType, total };
};
