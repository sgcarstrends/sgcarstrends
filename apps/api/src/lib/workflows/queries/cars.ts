import { db } from "@api/config/db";
import { cars } from "@sgcarstrends/database";
import { and, asc, desc, eq, gt, ne, sql, sum } from "drizzle-orm";

export const getCarsByMonth = (month: string) =>
  db
    .select({
      month: cars.month,
      make: cars.make,
      fuel_type: cars.fuel_type,
      vehicle_type: cars.vehicle_type,
      number: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(and(eq(cars.month, month), gt(cars.number, 0)))
    .groupBy(cars.month, cars.make, cars.fuel_type, cars.vehicle_type)
    .orderBy(asc(cars.make));

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
