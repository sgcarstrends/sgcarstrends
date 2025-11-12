import { coe, db } from "@sgcarstrends/database";
import type { COEResult } from "@web/types";
import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export interface COEMarketShareData {
  category: string;
  premium: number;
  percentage: number;
  quota: number;
  colour: string;
}

export const getCOEResults = async (): Promise<COEResult[]> => {
  "use cache";
  cacheLife("monthlyData");
  cacheTag("coe", "coe-all");

  const results = await db
    .select()
    .from(coe)
    .orderBy(desc(coe.month), asc(coe.bidding_no), asc(coe.vehicle_class));

  return results as COEResult[];
};

export const getCoeResultsFiltered = async (
  month?: string,
  start?: string,
  end?: string,
): Promise<COEResult[]> => {
  "use cache";
  cacheLife("monthlyData");

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
};
