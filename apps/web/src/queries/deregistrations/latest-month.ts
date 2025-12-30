import { db, deregistrations } from "@sgcarstrends/database";
import { sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Get the latest month available in deregistrations data
 */
export async function getDeregistrationsLatestMonth() {
  "use cache";
  cacheLife("max");
  cacheTag("deregistrations:months");

  const [result] = await db
    .select({ month: sql<string>`max(${deregistrations.month})` })
    .from(deregistrations);

  return result;
}
