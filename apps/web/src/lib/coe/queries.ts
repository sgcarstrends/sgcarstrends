import { coe, coePQP, db } from "@sgcarstrends/database";
import type { COEResult } from "@web/types";
import type { Pqp } from "@web/types/coe";
import { and, asc, desc, eq, gte, inArray, lte, max } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export interface COEMarketShareData {
  category: string;
  premium: number;
  percentage: number;
  quota: number;
  colour: string;
}

export async function getCOEResults(): Promise<COEResult[]> {
  "use cache";
  cacheLife("monthlyData");
  cacheTag("coe", "coe-all");

  const results = await db
    .select()
    .from(coe)
    .orderBy(desc(coe.month), asc(coe.bidding_no), asc(coe.vehicle_class));

  return results as COEResult[];
}

export async function getLatestCOEResults(): Promise<COEResult[]> {
  "use cache";
  cacheLife("latestData");
  cacheTag("coe", "latest-coe");

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
}

export async function getPQPData(): Promise<Record<string, Pqp.Rates>> {
  "use cache";
  cacheLife("monthlyData");
  cacheTag("coe", "pqp-all");

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
}

/**
 * Get COE results with optional filtering by month or date range
 * @param month - Filter by specific month (YYYY-MM format)
 * @param start - Filter by start date (inclusive, YYYY-MM format)
 * @param end - Filter by end date (inclusive, YYYY-MM format)
 */
export async function getCOEResultsFiltered(
  month?: string,
  start?: string,
  end?: string,
): Promise<COEResult[]> {
  "use cache";
  cacheLife("monthlyData");

  // Generate dynamic cache tags based on filters
  if (month) {
    cacheTag("coe", `coe-${month}`);
  } else if (start || end) {
    cacheTag("coe", `coe-range-${start || "all"}-${end || "all"}`);
  } else {
    cacheTag("coe", "coe-all");
  }

  const filters = [];

  if (month) {
    filters.push(eq(coe.month, month));
  }
  if (start) {
    filters.push(gte(coe.month, start));
  }
  if (end) {
    filters.push(lte(coe.month, end));
  }

  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  const results = await db
    .select()
    .from(coe)
    .where(whereClause)
    .orderBy(desc(coe.month), asc(coe.bidding_no), asc(coe.vehicle_class));

  return results as COEResult[];
}

/**
 * Get list of available months with COE data
 */
export async function getCOEMonths(): Promise<{ month: string }[]> {
  "use cache";
  cacheLife("statistics");
  cacheTag("coe", "coe-months");

  const results = await db
    .selectDistinct({ month: coe.month })
    .from(coe)
    .orderBy(desc(coe.month));

  return results.map((r) => ({ month: r.month ?? "" }));
}
