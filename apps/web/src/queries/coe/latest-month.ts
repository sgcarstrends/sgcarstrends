import { coe, db } from "@sgcarstrends/database";
import { max } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Get the latest month with COE bidding data
 */
export async function getCOELatestMonth(): Promise<string | null> {
  "use cache";
  cacheLife("max");
  cacheTag("coe:months");

  const [{ latestMonth }] = await db
    .select({ latestMonth: max(coe.month) })
    .from(coe);

  return latestMonth ?? null;
}
