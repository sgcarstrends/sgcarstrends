import { cars, db } from "@sgcarstrends/database";
import { and, desc, gt, ilike, max, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Get the latest year from car registration data
 */
const getLatestYear = async (): Promise<string> => {
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
};

/**
 * Get popular car makes based on annual registration totals
 */
const getPopularMakesByYearData = async (year: string, limit: number = 8) => {
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

  return results.map((result) => result.make as string);
};

/**
 * Query popular makes for the current year.
 * Returns array of make names sorted by registration volume.
 */
export const getPopularMakes = async (year?: string) => {
  "use cache";
  cacheLife("max");
  if (year) {
    cacheTag(`cars:year:${year}`);
  }

  const targetYear = year ?? (await getLatestYear());
  return getPopularMakesByYearData(targetYear, 8);
};
