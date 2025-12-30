import { db, deregistrations } from "@sgcarstrends/database";
import { desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Get deregistration breakdown by category for a specific month
 */
export async function getDeregistrationsByCategory(month: string) {
  "use cache";
  cacheLife("max");
  cacheTag(`deregistrations:month:${month}`);

  return db
    .select({
      category: deregistrations.category,
      total: sql<number>`cast(sum(${deregistrations.number}) as integer)`,
    })
    .from(deregistrations)
    .where(eq(deregistrations.month, month))
    .groupBy(deregistrations.category)
    .orderBy(desc(sql`sum(${deregistrations.number})`));
}

/**
 * Get total deregistrations for a specific month
 */
export async function getDeregistrationsTotalByMonth(month: string) {
  "use cache";
  cacheLife("max");
  cacheTag(`deregistrations:month:${month}`);

  return db
    .select({
      total: sql<number>`cast(sum(${deregistrations.number}) as integer)`,
    })
    .from(deregistrations)
    .where(eq(deregistrations.month, month));
}
