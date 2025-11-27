import { cars, coe, db } from "@sgcarstrends/database";
import { subMonths } from "date-fns";
import { and, asc, avg, gte, ilike, inArray, lte, sql } from "drizzle-orm";

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
  const { startMonth, endMonth } = getDateRange24Months();

  const pattern = make.replaceAll("-", "%");

  // Execute both queries in parallel using db.batch()
  const [makeRegistrations, coePremiums] = await db.batch([
    // Query 1: Fetch make registrations by month
    db
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
      .orderBy(asc(cars.month)),

    // Query 2: Fetch COE premium averages for Category A and B using CASE WHEN
    db
      .select({
        month: coe.month,
        categoryAPremium: avg(
          sql`CASE WHEN ${coe.vehicleClass} = 'Category A' THEN ${coe.premium} END`,
        ).mapWith(Number),
        categoryBPremium: avg(
          sql`CASE WHEN ${coe.vehicleClass} = 'Category B' THEN ${coe.premium} END`,
        ).mapWith(Number),
      })
      .from(coe)
      .where(
        and(
          gte(coe.month, startMonth),
          lte(coe.month, endMonth),
          inArray(coe.vehicleClass, ["Category A", "Category B"]),
        ),
      )
      .groupBy(coe.month)
      .orderBy(asc(coe.month)),
  ]);

  // Create a Map for efficient COE premium lookup by month
  const coePremiumMap = new Map(
    coePremiums.map((coe) => [
      coe.month,
      {
        categoryA: coe.categoryAPremium ?? 0,
        categoryB: coe.categoryBPremium ?? 0,
      },
    ]),
  );

  return makeRegistrations.map(({ month, count }) => ({
    month,
    registrations: count,
    categoryAPremium: coePremiumMap.get(month)?.categoryA ?? 0,
    categoryBPremium: coePremiumMap.get(month)?.categoryB ?? 0,
  }));
};
