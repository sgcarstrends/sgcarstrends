import { coePQP, db } from "@sgcarstrends/database";
import type { Pqp } from "@web/types/coe";
import { asc, desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export const getPqpRates = async (): Promise<Record<string, Pqp.Rates>> => {
  "use cache";
  cacheLife("monthlyData");
  cacheTag("coe", "pqp-all");

  const results = await db
    .select()
    .from(coePQP)
    .orderBy(desc(coePQP.month), asc(coePQP.vehicle_class));

  return results.reduce<Record<string, Pqp.Rates>>(
    (grouped, { month, vehicle_class, pqp }) => {
      if (!grouped[month]) {
        grouped[month] = {} as Pqp.Rates;
      }
      grouped[month][vehicle_class as keyof Pqp.Rates] = pqp ?? 0;
      return grouped;
    },
    {},
  );
};
