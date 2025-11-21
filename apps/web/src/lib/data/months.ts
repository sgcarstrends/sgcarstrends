import { cars, coe, db } from "@sgcarstrends/database";
import { CACHE_LIFE, CACHE_TAG } from "@web/lib/cache";
import { desc, max } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Generic function to get the latest month from any table with a month column
 * @param table - The Drizzle table to query
 * @returns The latest month string or null if no data
 */
export const getLatestMonth = async (
  table: typeof cars | typeof coe,
): Promise<string | null> => {
  try {
    const [result] = await db.select({ month: max(table.month) }).from(table);

    if (!result?.month) {
      console.warn(`No data found for table`);
      return null;
    }

    return result.month;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

/**
 * Get the latest month with car registration data
 */
export async function getCarsLatestMonth(): Promise<string | null> {
  "use cache";
  cacheLife("max");
  cacheTag(...CACHE_TAG.cars.latestMonth());

  const result = await db.query.cars.findFirst({
    columns: { month: true },
    orderBy: desc(cars.month),
  });

  return result?.month ?? null;
}

/**
 * Get the latest month with COE bidding data
 */
export async function getCOELatestMonth(): Promise<string | null> {
  "use cache";
  cacheLife("max");
  cacheTag(...CACHE_TAG.coe.latestMonth());

  const [{ latestMonth }] = await db
    .select({ latestMonth: max(coe.month) })
    .from(coe);

  return latestMonth ?? null;
}

interface LatestMonths {
  cars: string | null;
  coe: string | null;
}

/**
 * Get the latest months for both cars and COE data
 * Useful for displaying month selectors or determining the most recent data available
 */
export const getLatestMonths = async (): Promise<LatestMonths> => {
  const [carsMonth, coeMonth] = await Promise.all([
    getCarsLatestMonth(),
    getCOELatestMonth(),
  ]);

  return {
    cars: carsMonth,
    coe: coeMonth,
  };
};

/**
 * Get the latest month across both cars and COE datasets
 * Returns the most recent month between the two
 */
export const getOverallLatestMonth = async (): Promise<string | null> => {
  const { cars, coe } = await getLatestMonths();

  if (!cars && !coe) return null;
  if (!cars) return coe;
  if (!coe) return cars;

  // Return the more recent of the two months
  return cars > coe ? cars : coe;
};
