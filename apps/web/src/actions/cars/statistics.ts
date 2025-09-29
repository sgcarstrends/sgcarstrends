"use server";

import { cars, db } from "@sgcarstrends/database";
import { and, desc, eq, gt, isNotNull, sql } from "drizzle-orm";
import { cache } from "react";

const yearExpr = sql`extract(year from to_date(${cars.month}, 'YYYY-MM'))`;

/**
 * Get yearly registration totals aggregated from monthly data
 */
export const getYearlyRegistrations = cache(async () => {
  const results = await db
    .select({
      year: sql<string>`${yearExpr}`,
      total: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(gt(cars.number, 0))
    .groupBy(yearExpr)
    .orderBy(yearExpr);

  return results.map((result) => ({
    year: Number.parseInt(result.year, 10),
    total: result.total,
  }));
});

/**
 * Get top car makes aggregated by year (defaults to latest year)
 */
export const getTopMakesByYear = cache(async (year?: number, limit = 8) => {
  let targetYear = year;

  if (!targetYear) {
    const [latest] = await db
      .select({
        year: sql<string>`${yearExpr}`,
      })
      .from(cars)
      .where(gt(cars.number, 0))
      .groupBy(yearExpr)
      .orderBy(desc(yearExpr))
      .limit(1);

    if (!latest?.year) return [];
    targetYear = Number.parseInt(latest.year, 10);
  }

  const sumExpr = sql`sum(${cars.number})`;

  return db
    .select({
      make: sql<string>`${cars.make}`,
      value: sql<number>`cast(${sumExpr} as integer)`,
    })
    .from(cars)
    .where(
      and(eq(yearExpr, targetYear), gt(cars.number, 0), isNotNull(cars.make)),
    )
    .groupBy(cars.make)
    .orderBy(desc(sumExpr))
    .limit(limit);
});
