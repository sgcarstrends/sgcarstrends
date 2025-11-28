import { coe, db } from "@sgcarstrends/database";
import type { Period } from "@web/app/(dashboard)/coe/search-params";
import type { COEResult } from "@web/types";
import { format, subMonths, subYears } from "date-fns";
import { and, asc, desc, gte, lte } from "drizzle-orm";
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
  cacheTag("coe:results");

  const results = await db
    .select()
    .from(coe)
    .orderBy(asc(coe.month), asc(coe.biddingNo), asc(coe.vehicleClass));

  return results as COEResult[];
};

const getDateRangeFromPeriod = (
  period: Period,
  latestMonth: string,
  earliestMonth: string,
): { start: string; end: string } => {
  const latest = new Date(`${latestMonth}-01`);

  switch (period) {
    case "12m":
      return {
        start: format(subMonths(latest, 12), "yyyy-MM"),
        end: latestMonth,
      };
    case "5y":
      return {
        start: format(subYears(latest, 5), "yyyy-MM"),
        end: latestMonth,
      };
    case "10y":
      return {
        start: format(subYears(latest, 10), "yyyy-MM"),
        end: latestMonth,
      };
    case "ytd":
      return { start: `${new Date().getFullYear()}-01`, end: latestMonth };
    case "all":
      return { start: earliestMonth, end: latestMonth };
  }
};

export const getCoeResultsByPeriod = async (
  period: Period = "12m",
): Promise<COEResult[]> => {
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
};
