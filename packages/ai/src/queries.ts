import { cars, coe, db } from "@sgcarstrends/database";
import { and, asc, eq, gt, sql } from "drizzle-orm";

export const getCarsAggregatedByMonth = (month: string) =>
  db
    .select({
      month: cars.month,
      make: cars.make,
      fuelType: cars.fuelType,
      vehicleType: cars.vehicleType,
      number: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(and(eq(cars.month, month), gt(cars.number, 0)))
    .groupBy(cars.month, cars.make, cars.fuelType, cars.vehicleType)
    .orderBy(asc(cars.make));

export const getCoeForMonth = async (month: string) =>
  db.query.coe.findMany({
    columns: { id: false },
    where: eq(coe.month, month),
    orderBy: [asc(coe.biddingNo), asc(coe.vehicleClass)],
  });
