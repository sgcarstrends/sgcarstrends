import { db, pqp } from "@sgcarstrends/database";
import { CACHE_TAG } from "@web/lib/cache";
import type { Pqp } from "@web/types/coe";
import { asc, desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

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
