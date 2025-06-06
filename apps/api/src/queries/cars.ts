import db from "@api/config/db";
import { cars } from "@sgcarstrends/schema";
import { desc, eq, sql, sum } from "drizzle-orm";

export const getCarsByMonth = (month: string) =>
  db.query.cars.findMany({
    where: eq(cars.month, month),
    columns: {
      number: true,
      fuel_type: true,
      vehicle_type: true,
    },
  });

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
