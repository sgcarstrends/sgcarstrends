import { coe, db } from "@sgcarstrends/database";
import { CACHE_TAG } from "@web/lib/cache";
import type { COEResult } from "@web/types";
import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export interface CoeMarketShareData {
  category: string;
  premium: number;
  percentage: number;
  quota: number;
  colour: string;
}

export const getCoeResults = async (): Promise<COEResult[]> => {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAG.COE);

  const results = await db
    .select()
    .from(coe)
    .orderBy(desc(coe.month), asc(coe.biddingNo), asc(coe.vehicleClass));

  return results as COEResult[];
};

export const getCoeResultsFiltered = async (
  month?: string,
  start?: string,
  end?: string,
): Promise<COEResult[]> => {
  "use cache";
  cacheLife("max");

  if (month) {
    cacheTag(CACHE_TAG.COE);
  } else if (start || end) {
    cacheTag(CACHE_TAG.COE);
  } else {
    cacheTag(CACHE_TAG.COE);
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
    .orderBy(desc(coe.month), asc(coe.biddingNo), asc(coe.vehicleClass));

  return results as COEResult[];
};
