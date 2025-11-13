import { db, pqp } from "@sgcarstrends/database";
import type { Pqp } from "@web/types/coe";
import { asc, desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export const getPqpRates = async (): Promise<Record<string, Pqp.Rates>> => {
  "use cache";
  cacheLife("monthlyData");
  cacheTag("coe", "pqp-all");

  const results = await db
    .select()
    .from(pqp)
    .orderBy(desc(pqp.month), asc(pqp.vehicleClass));

  return results.reduce<Record<string, Pqp.Rates>>(
    (grouped, { month, vehicleClass, pqp }) => {
      if (!grouped[month]) {
        grouped[month] = {} as Pqp.Rates;
      }
      grouped[month][vehicleClass as keyof Pqp.Rates] = pqp ?? 0;
      return grouped;
    },
    {},
  );
};
