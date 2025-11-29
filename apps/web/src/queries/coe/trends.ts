import { coe, db, type SelectCOE } from "@sgcarstrends/database";
import { getDateRangeForYear } from "@web/lib/coe/calculations";
import type { COECategory } from "@web/types";
import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

const COE_CATEGORIES: COECategory[] = [
  "Category A",
  "Category B",
  "Category C",
  "Category D",
  "Category E",
];

const fetchCoeResults = async (
  startMonth: string,
  endMonth: string,
  category?: COECategory,
) => {
  const filters = [gte(coe.month, startMonth), lte(coe.month, endMonth)];

  if (category) {
    filters.push(eq(coe.vehicleClass, category));
  }

  return db
    .select()
    .from(coe)
    .where(and(...filters))
    .orderBy(asc(coe.month), desc(coe.biddingNo));
};

const upsertMonthlyTrend = (
  trends: Map<string, CoeMonthlyPremium>,
  result: SelectCOE,
) => {
  const biddingNo = result.biddingNo;

  const existing = trends.get(result.month);

  if (!existing || biddingNo > existing.biddingNo) {
    trends.set(result.month, {
      month: result.month,
      premium: result.premium,
      biddingNo,
    });
  }
};

export interface CoeMonthlyPremium {
  month: string;
  premium: number;
  biddingNo: number;
}

export const getCoeCategoryTrends = async (
  category: COECategory,
  year?: number,
): Promise<CoeMonthlyPremium[]> => {
  "use cache";
  cacheLife("max");
  cacheTag(`coe:category:${category}`);
  if (year) {
    cacheTag(`coe:year:${year}`);
  }

  const { startMonth, endMonth } = getDateRangeForYear(year);

  const results = await fetchCoeResults(startMonth, endMonth, category);
  const monthlyTrends = new Map<string, CoeMonthlyPremium>();

  for (const result of results) {
    upsertMonthlyTrend(monthlyTrends, result);
  }

  return Array.from(monthlyTrends.values());
};

export const getAllCoeCategoryTrends = async (
  year?: number,
): Promise<Record<COECategory, CoeMonthlyPremium[]>> => {
  "use cache";
  cacheLife("max");
  if (year) {
    cacheTag(`coe:year:${year}`);
  }

  const { startMonth, endMonth } = getDateRangeForYear(year);

  const results = await fetchCoeResults(startMonth, endMonth);

  const categoryTrends = new Map<COECategory, Map<string, CoeMonthlyPremium>>();
  for (const category of COE_CATEGORIES) {
    categoryTrends.set(category, new Map());
  }

  for (const result of results) {
    const categoryMap = categoryTrends.get(result.vehicleClass as COECategory);
    if (!categoryMap) continue;
    upsertMonthlyTrend(categoryMap, result);
  }

  return Object.fromEntries(
    COE_CATEGORIES.map((category) => [
      category,
      Array.from(categoryTrends.get(category)?.values() ?? []),
    ]),
  ) as Record<COECategory, CoeMonthlyPremium[]>;
};
