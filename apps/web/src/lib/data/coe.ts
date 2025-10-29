import { coe, coePQP, db } from "@sgcarstrends/database";
import type { COEResult } from "@web/types";
import type { Pqp } from "@web/types/coe";
import { and, asc, desc, eq, inArray, max } from "drizzle-orm";

export interface COEMarketShareData {
  category: string;
  premium: number;
  percentage: number;
  quota: number;
  colour: string;
}

export const getCOEResults = async (): Promise<COEResult[]> => {
  const results = await db
    .select()
    .from(coe)
    .orderBy(desc(coe.month), asc(coe.bidding_no), asc(coe.vehicle_class));

  return results as COEResult[];
};

export const getLatestCOEResults = async (): Promise<COEResult[]> => {
  const [{ latestMonth }] = await db
    .select({ latestMonth: max(coe.month) })
    .from(coe);

  if (!latestMonth) {
    return [];
  }

  const results = await db
    .select()
    .from(coe)
    .where(
      and(
        eq(coe.month, latestMonth),
        inArray(
          coe.bidding_no,
          db
            .select({ bidding_no: max(coe.bidding_no) })
            .from(coe)
            .where(eq(coe.month, latestMonth)),
        ),
      ),
    )
    .orderBy(desc(coe.bidding_no), asc(coe.vehicle_class));

  return results as COEResult[];
};

export const getPQPData = async (): Promise<Record<string, Pqp.Rates>> => {
  const results = await db
    .select()
    .from(coePQP)
    .orderBy(desc(coePQP.month), asc(coePQP.vehicle_class));

  return results.reduce<Record<string, Pqp.Rates>>(
    (grouped, { month, vehicle_class, pqp }) => {
      if (!month || !pqp) return grouped;

      if (!grouped[month]) {
        grouped[month] = {} as Pqp.Rates;
      }
      grouped[month][vehicle_class as keyof Pqp.Rates] = pqp;
      return grouped;
    },
    {},
  );
};
