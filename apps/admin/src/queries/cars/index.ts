import { cars, db } from "@sgcarstrends/database";
import { and, asc, eq, gt, sql } from "drizzle-orm";

export const getCarsAggregatedByMonth = (month: string) => {
  return db
    .select({
      month: cars.month,
      make: cars.make,
      fuel_type: cars.fuelType,
      vehicle_type: cars.vehicleType,
      number: sql<number>`cast(sum(
            ${cars.number}
            )
            as
            integer
            )`,
    })
    .from(cars)
    .where(and(eq(cars.month, month), gt(cars.number, 0)))
    .groupBy(cars.month, cars.make, cars.fuelType, cars.vehicleType)
    .orderBy(asc(cars.make));
};
