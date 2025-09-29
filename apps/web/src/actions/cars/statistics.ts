"use server";

import { cars, db } from "@sgcarstrends/database";
import { desc, gt, sql } from "drizzle-orm";
import { cache } from "react";

/**
 * Get yearly registration totals aggregated from monthly data
 */
export const getYearlyRegistrations = cache(async () => {
  const results = await db
    .select({
      year: sql<string>`extract(year from to_date(${cars.month}, 'YYYY-MM'))`,
      total: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(gt(cars.number, 0))
    .groupBy(sql`extract(year from to_date(${cars.month}, 'YYYY-MM'))`)
    .orderBy(sql`extract(year from to_date(${cars.month}, 'YYYY-MM'))`);

  return results.map((result) => ({
    year: parseInt(result.year, 10),
    total: result.total,
  }));
});

/**
 * Get top car makes for the latest available month
 */
export const getTopMakes = cache(async (limit: number = 5) => {
  // Get the latest month
  const [latestMonthResult] = await db
    .select({
      month: cars.month,
    })
    .from(cars)
    .orderBy(desc(cars.month))
    .limit(1);

  if (!latestMonthResult) {
    return [];
  }

  // Get top makes for the latest month
  const results = await db
    .select({
      make: cars.make,
      value: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(
      sql`${cars.month} = ${latestMonthResult.month} AND ${cars.number} > 0`,
    )
    .groupBy(cars.make)
    .orderBy(desc(sql`sum(${cars.number})`))
    .limit(limit);

  return results.map((result) => ({
    make: result.make,
    value: result.value,
  }));
});

/**
 * Get the latest month with data
 */
export const getLatestMonth = cache(async () => {
  const [result] = await db
    .select({
      month: cars.month,
    })
    .from(cars)
    .orderBy(desc(cars.month))
    .limit(1);

  return result?.month;
});
