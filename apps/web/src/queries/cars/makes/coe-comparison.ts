import { cars, coe, db } from "@sgcarstrends/database";
import { CACHE_LIFE } from "@web/lib/cache";
import type { COECategory } from "@web/types";
import { subMonths } from "date-fns";
import { and, desc, gte, ilike, inArray, lte, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export interface MakeCoeComparisonData {
  month: string;
  registrations: number;
  categoryAPremium: number;
  categoryBPremium: number;
}

const getDateRange24Months = () => {
  const currentDate = new Date();
  const startDate = subMonths(currentDate, 24);

  const startMonth = startDate.toISOString().slice(0, 7);
  const endMonth = currentDate.toISOString().slice(0, 7);

  return { startMonth, endMonth };
};

export const getMakeCoeComparison = async (
  make: string,
): Promise<MakeCoeComparisonData[]> => {
  "use cache";
  cacheLife("max");

  const { startMonth, endMonth } = getDateRange24Months();
  cacheTag(CACHE_LIFE.cars);
  cacheTag(CACHE_LIFE.coe);

  const pattern = make.replaceAll("-", "%");

  // Fetch make registrations by month
  const makeRegistrations = await db
    .select({
      month: cars.month,
      count: sql<number>`sum(${cars.number})`.mapWith(Number),
    })
    .from(cars)
    .where(
      and(
        ilike(cars.make, pattern),
        gte(cars.month, startMonth),
        lte(cars.month, endMonth),
      ),
    )
    .groupBy(cars.month)
    .orderBy(desc(cars.month));

  // Fetch COE premiums for both Category A and B
  const coePremiums = await db
    .select({
      month: coe.month,
      vehicleClass: coe.vehicleClass,
      premium: coe.premium,
      biddingNo: coe.biddingNo,
    })
    .from(coe)
    .where(
      and(
        gte(coe.month, startMonth),
        lte(coe.month, endMonth),
        inArray(coe.vehicleClass, ["Category A", "Category B"]),
      ),
    )
    .orderBy(desc(coe.month), desc(coe.biddingNo));

  // Get latest bidding per month for each category
  const coeByMonth = new Map<
    string,
    { categoryA: number; categoryB: number }
  >();

  for (const result of coePremiums) {
    const monthData = coeByMonth.get(result.month) ?? {
      categoryA: 0,
      categoryB: 0,
    };

    // Only update if this is a higher bidding number (latest)
    const category = result.vehicleClass as COECategory;

    if (category === "Category A" && monthData.categoryA === 0) {
      monthData.categoryA = result.premium;
    } else if (category === "Category B" && monthData.categoryB === 0) {
      monthData.categoryB = result.premium;
    }

    coeByMonth.set(result.month, monthData);
  }

  return makeRegistrations.map(({ month, count }) => ({
    month,
    registrations: count,
    categoryAPremium: coeByMonth.get(month)?.categoryA ?? 0,
    categoryBPremium: coeByMonth.get(month)?.categoryB ?? 0,
  }));
};
