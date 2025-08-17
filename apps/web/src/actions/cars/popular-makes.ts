"use server";

import { cars } from "@sgcarstrends/database";
import { db } from "@web/config/db";
import { and, desc, gt, ilike, max, sql } from "drizzle-orm";
import { cache } from "react";

/**
 * Get the latest year from car registration data
 */
async function getLatestYear(): Promise<string> {
  const [result] = await db
    .select({
      latestMonth: max(cars.month),
    })
    .from(cars);

  const latestMonth = result.latestMonth;
  if (!latestMonth) {
    // Fallback to current year if no data
    return new Date().getFullYear().toString();
  }

  return latestMonth.split("-")[0];
}

/**
 * Get popular car makes based on annual registration totals
 */
async function getPopularMakesByYearData(year: string, limit: number = 8) {
  const whereConditions = [ilike(cars.month, `${year}-%`), gt(cars.number, 0)];

  const results = await db
    .select({
      make: cars.make,
      totalRegistrations: sql<number>`cast(sum(${cars.number}) as integer)`,
    })
    .from(cars)
    .where(and(...whereConditions))
    .groupBy(cars.make)
    .orderBy(desc(sql`sum(${cars.number})`))
    .limit(limit);

  return results.map((result) => result.make);
}

/**
 * Server action to get popular makes for the current year
 * Returns array of make names sorted by registration volume
 */
export const getPopularMakes = cache(
  async (year?: string): Promise<string[]> => {
    const targetYear = year || (await getLatestYear());
    return getPopularMakesByYearData(targetYear, 8);
  },
);
