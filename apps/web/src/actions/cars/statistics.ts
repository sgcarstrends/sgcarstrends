"use server";

import { cars, db } from "@sgcarstrends/database";
import { and, desc, gt, sql } from "drizzle-orm";
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
 * Get monthly registration totals grouped by year
 */
export const getMonthlyRegistrationsByYear = cache(async () => {
  const results = await db
    .select({
      month: cars.month,
      total: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(gt(cars.number, 0))
    .groupBy(cars.month)
    .orderBy(sql`to_date(${cars.month}, 'YYYY-MM')`);

  const byYear = new Map<string, { month: string; total: number }[]>();
  for (const row of results) {
    const year = row.month.slice(0, 4);
    const arr = byYear.get(year) ?? [];
    arr.push({ month: row.month, total: row.total });
    byYear.set(year, arr);
  }

  return Array.from(byYear.entries())
    .map(([year, months]) => ({ year: parseInt(year, 10), months }))
    .sort((a, b) => a.year - b.year);
});

/**
 * Get top car makes aggregated by year (defaults to latest year)
 */
export const getTopMakesByYear = cache(
  async (year?: number, limit: number = 8) => {
    // Determine latest available year if not provided
    let targetYear = year;
    if (targetYear === undefined) {
      const [latest] = await db
        .select({
          year: sql<string>`extract(year from to_date(${cars.month}, 'YYYY-MM'))`,
        })
        .from(cars)
        .where(gt(cars.number, 0))
        .groupBy(sql`extract(year from to_date(${cars.month}, 'YYYY-MM'))`)
        .orderBy(
          desc(sql`extract(year from to_date(${cars.month}, 'YYYY-MM'))`),
        )
        .limit(1);

      if (!latest?.year) return [];
      targetYear = parseInt(latest.year, 10);
    }

    const results = await db
      .select({
        make: cars.make,
        value: sql<number>`cast(sum(${cars.number}) as integer)`,
      })
      .from(cars)
      .where(
        and(
          sql`extract(year from to_date(${cars.month}, 'YYYY-MM')) = ${targetYear}`,
          gt(cars.number, 0),
        ),
      )
      .groupBy(cars.make)
      .orderBy(desc(sql`sum(${cars.number})`))
      .limit(limit);

    return results.map((result) => ({
      make: result.make,
      value: result.value,
    }));
  },
);
