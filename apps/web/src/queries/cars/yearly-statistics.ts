import { cars, db } from "@sgcarstrends/database";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

const yearExpr = sql`extract(year from to_date(${cars.month}, 'YYYY-MM'))`;

/**
 * Get yearly registration totals aggregated from monthly data
 */
export const getYearlyRegistrations = async () => {
  "use cache";
  cacheLife("max");
  cacheTag("cars:annual");

  return db
    .select({
      year: sql<number>`cast(${yearExpr} as integer)`,
      total: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(gt(cars.number, 0))
    .groupBy(yearExpr)
    .orderBy(yearExpr);
};

/**
 * Get top car makes aggregated by year (defaults to latest year)
 */
export const getTopMakesByYear = async (year?: number, limit = 8) => {
  "use cache";
  cacheLife("max");
  if (year) {
    cacheTag(`cars:year:${year}`);
  }

  let targetYear = year;

  if (!targetYear) {
    const [latest] = await db
      .select({
        year: sql<number>`cast(${yearExpr} as integer)`,
      })
      .from(cars)
      .where(gt(cars.number, 0))
      .groupBy(yearExpr)
      .orderBy(desc(yearExpr))
      .limit(1);

    if (!latest?.year) return [];
    targetYear = latest.year;
  }

  const sumExpr = sql`sum(${cars.number})`;

  return db
    .select({
      make: sql<string>`${cars.make}`,
      value: sql<number>`cast(${sumExpr} as integer)`,
    })
    .from(cars)
    .where(and(eq(yearExpr, targetYear), gt(cars.number, 0)))
    .groupBy(cars.make)
    .orderBy(desc(sumExpr))
    .limit(limit);
};
