import db from "@api/config/db";
import { cars } from "@sgcarstrends/schema";
import { and, asc, desc, eq, gt, ilike, sql, sum } from "drizzle-orm";

export const getCarsByMonth = (month: string) =>
  db.query.cars.findMany({
    where: eq(cars.month, month),
    columns: {
      number: true,
      fuel_type: true,
      vehicle_type: true,
    },
  });

export const getCarRegistrationByMonth = (month: string) =>
  db
    .select({ total: sql<number>`cast(sum(${cars.number}) as integer)` })
    .from(cars)
    .where(eq(cars.month, month));

export const getCarsByFuelType = (month: string) =>
  db
    .select({
      name: cars.fuel_type,
      count: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.fuel_type)
    .orderBy(desc(sum(cars.number)))
    .having(gt(sum(cars.number), 0));

export const getCarsByVehicleType = (month: string) =>
  db
    .select({
      name: cars.vehicle_type,
      count: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.vehicle_type)
    .orderBy(desc(sum(cars.number)))
    .having(gt(sum(cars.number), 0));

export const getCarsTopMakesByFuelType = async (month: string) => {
  // First get all fuel types with their totals
  const fuelTypes = await db
    .select({
      fuelType: cars.fuel_type,
      total: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(eq(cars.month, month))
    .groupBy(cars.fuel_type)
    .orderBy(asc(cars.fuel_type))
    .having(gt(sum(cars.number), 0));

  // Get top 3 makes for each fuel type
  return Promise.all(
    fuelTypes.map(async ({ fuelType, total }) => {
      const whereConditions = [
        eq(cars.month, month),
        eq(cars.fuel_type, fuelType),
      ];

      const topMakes = await db
        .select({
          make: cars.make,
          count: sql<number>`cast(sum(${cars.number}) as integer)`,
        })
        .from(cars)
        .where(and(...whereConditions))
        .groupBy(cars.make, cars.fuel_type)
        .having(gt(sum(cars.number), 0))
        .orderBy(desc(sum(cars.number)))
        .limit(3);

      return {
        fuelType,
        total,
        makes: topMakes,
      };
    }),
  );
};

export const getTopTypes = (month: string) =>
  db.batch([
    db
      .select({
        name: cars.fuel_type,
        total: sql<number>`cast(sum(${cars.number}) as integer)`,
      })
      .from(cars)
      .where(eq(cars.month, month))
      .groupBy(cars.fuel_type)
      .orderBy(desc(sum(cars.number)))
      .limit(1),
    db
      .select({
        name: cars.vehicle_type,
        total: sql<number>`cast(sum(${cars.number}) as integer)`,
      })
      .from(cars)
      .where(eq(cars.month, month))
      .groupBy(cars.vehicle_type)
      .orderBy(desc(sum(cars.number)))
      .limit(1),
  ]);

export const getDistinctMakes = () =>
  db.selectDistinct({ make: cars.make }).from(cars).orderBy(asc(cars.make));

export const getMatchingMake = async (make: string) =>
  db.query.cars.findFirst({
    where: ilike(cars.make, `%${make.replaceAll("-", " ")}%`),
    columns: { make: true },
  });

export const getMake = async (make: string, month: string) => {
  const searchPattern = make.replaceAll("-", " ");
  const whereConditions = [ilike(cars.make, `%${searchPattern}%`)];

  if (month) {
    whereConditions.push(eq(cars.month, month));
  }

  return db
    .select({
      month: cars.month,
      fuelType: cars.fuel_type,
      vehicleType: cars.vehicle_type,
      count: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(and(...whereConditions))
    .groupBy(cars.month, cars.fuel_type, cars.vehicle_type)
    .orderBy(desc(cars.month));
};
