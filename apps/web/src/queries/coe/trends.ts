import { coe, db } from "@sgcarstrends/database";
import { CACHE_LIFE, CACHE_TAG } from "@web/lib/cache";
import type { COECategory } from "@web/types";
import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export interface CoeMonthlyPremium {
  month: string;
  premium: number;
  biddingNo: number;
}

export const getCOECategoryTrends = async (
  category: COECategory,
  year?: number,
): Promise<CoeMonthlyPremium[]> => {
  "use cache";
  cacheLife(CACHE_LIFE.monthlyData);

  const currentYear = new Date().getFullYear();
  const targetYear = year ?? currentYear;

  // Determine date range based on year
  const startDate = `${targetYear}-01-01`;
  const endDate =
    targetYear < currentYear
      ? `${targetYear}-12-31` // Full year for past years
      : new Date().toISOString().split("T")[0]; // YTD for current year

  cacheTag(...CACHE_TAG.coe.range(startDate, endDate));

  // Fetch all results for the category within the date range
  const results = await db
    .select()
    .from(coe)
    .where(
      and(
        eq(coe.vehicleClass, category),
        gte(coe.month, startDate),
        lte(coe.month, endDate),
      ),
    )
    .orderBy(asc(coe.month), desc(coe.biddingNo));

  // Group by month and take the latest bidding number for each month
  const monthlyTrends = new Map<string, CoeMonthlyPremium>();

  for (const result of results) {
    const biddingNo = result.biddingNo;
    if (typeof biddingNo !== "number") {
      continue;
    }
    const existing = monthlyTrends.get(result.month);
    const premium = typeof result.premium === "number" ? result.premium : 0;

    // Keep the result with the highest bidding number (latest in the month)
    if (!existing || biddingNo > existing.biddingNo) {
      monthlyTrends.set(result.month, {
        month: result.month,
        premium,
        biddingNo,
      });
    }
  }

  return Array.from(monthlyTrends.values());
};

export const getAllCOECategoryTrends = async (
  year?: number,
): Promise<Record<COECategory, CoeMonthlyPremium[]>> => {
  "use cache";
  cacheLife(CACHE_LIFE.monthlyData);

  const currentYear = new Date().getFullYear();
  const targetYear = year ?? currentYear;

  const startDate = `${targetYear}-01-01`;
  const endDate =
    targetYear < currentYear
      ? `${targetYear}-12-31`
      : new Date().toISOString().split("T")[0];

  cacheTag(...CACHE_TAG.coe.range(startDate, endDate));

  const categories: COECategory[] = [
    "Category A",
    "Category B",
    "Category C",
    "Category D",
    "Category E",
  ];

  // Fetch all results within the date range
  const results = await db
    .select()
    .from(coe)
    .where(and(gte(coe.month, startDate), lte(coe.month, endDate)))
    .orderBy(asc(coe.month), desc(coe.biddingNo));

  // Group by category and month, taking latest bidding per month
  const categoryTrends = new Map<COECategory, Map<string, CoeMonthlyPremium>>();
  for (const category of categories) {
    categoryTrends.set(category, new Map());
  }

  for (const result of results) {
    const biddingNo = result.biddingNo;
    if (typeof biddingNo !== "number") {
      continue;
    }
    const categoryMap = categoryTrends.get(result.vehicleClass as COECategory);
    if (!categoryMap) continue;

    const existing = categoryMap.get(result.month);
    const premium = typeof result.premium === "number" ? result.premium : 0;

    if (!existing || biddingNo > existing.biddingNo) {
      categoryMap.set(result.month, {
        month: result.month,
        premium,
        biddingNo,
      });
    }
  }

  // Convert maps to arrays
  return Object.fromEntries(
    categories.map((category) => [
      category,
      Array.from(categoryTrends.get(category)?.values() ?? []),
    ]),
  ) as Record<COECategory, CoeMonthlyPremium[]>;
};
