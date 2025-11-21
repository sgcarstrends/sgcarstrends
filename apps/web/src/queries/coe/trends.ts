import { coe, db, type SelectCOE } from "@sgcarstrends/database";
import { CACHE_LIFE } from "@web/lib/cache";
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

const formatCurrentMonth = (date: Date) => date.toISOString().slice(0, 7);

const getDateRange = (year?: number) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const targetYear = year ?? currentYear;

  const startMonth = `${targetYear}-01`;
  const endMonth =
    targetYear < currentYear
      ? `${targetYear}-12`
      : formatCurrentMonth(currentDate);

  return { startMonth, endMonth };
};

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
  if (typeof biddingNo !== "number") {
    return;
  }

  const premium = typeof result.premium === "number" ? result.premium : 0;
  const existing = trends.get(result.month);

  if (!existing || biddingNo > existing.biddingNo) {
    trends.set(result.month, {
      month: result.month,
      premium,
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

  const { startMonth, endMonth } = getDateRange(year);
  cacheTag(CACHE_LIFE.coe);

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

  const { startMonth, endMonth } = getDateRange(year);
  cacheTag(CACHE_LIFE.coe);

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
