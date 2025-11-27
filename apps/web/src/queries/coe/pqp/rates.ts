import { db, pqp } from "@sgcarstrends/database";
import type { Pqp } from "@web/types/coe";
import { asc, desc } from "drizzle-orm";

export const getPqpRates = async (): Promise<Record<string, Pqp.Rates>> => {
  const results = await db
    .select()
    .from(pqp)
    .orderBy(desc(pqp.month), asc(pqp.vehicleClass));

  return results.reduce<Record<string, Pqp.Rates>>(
    (groupedByMonth, { month, vehicleClass, pqp }) => {
      if (!groupedByMonth[month]) {
        groupedByMonth[month] = {} as Pqp.Rates;
      }
      groupedByMonth[month][vehicleClass as keyof Pqp.Rates] = pqp ?? 0;
      return groupedByMonth;
    },
    {},
  );
};
