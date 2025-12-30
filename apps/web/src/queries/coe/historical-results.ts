import { coe, db } from "@sgcarstrends/database";
import type { Period } from "@web/app/(dashboard)/coe/search-params";
import { getDateRangeFromPeriod } from "@web/lib/coe/calculations";
import type { COEResult } from "@web/types";
import { and, asc, desc, gte, lte } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export interface CoeMarketShareData {
  category: string;
  premium: number;
  percentage: number;
  quota: number;
  colour: string;
}

export async function getCoeResults(): Promise<COEResult[]> {
  "use cache";
  cacheLife("max");
  cacheTag("coe:results");

  const results = await db
    .select()
    .from(coe)
    .orderBy(asc(coe.month), asc(coe.biddingNo), asc(coe.vehicleClass));

  return results as COEResult[];
}

export async function getCoeResultsByPeriod(
  period: Period = "12m",
): Promise<COEResult[]> {
  "use cache";
  cacheLife("max");
  cacheTag(`coe:period:${period}`);

  // Get latest and earliest months for period calculation
  const monthsResult = await db
    .selectDistinct({ month: coe.month })
    .from(coe)
    .orderBy(desc(coe.month));

  if (monthsResult.length === 0) {
    return [];
  }

  const latestMonth = monthsResult[0].month;
  const earliestMonth = monthsResult[monthsResult.length - 1].month;

  const { start, end } = getDateRangeFromPeriod(
    period,
    latestMonth,
    earliestMonth,
  );

  const results = await db
    .select()
    .from(coe)
    .where(and(gte(coe.month, start), lte(coe.month, end)))
    .orderBy(asc(coe.month), asc(coe.biddingNo), asc(coe.vehicleClass));

  return results as COEResult[];
}
