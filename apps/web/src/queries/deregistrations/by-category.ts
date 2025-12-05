import { db, deregistrations } from "@sgcarstrends/database";
import { desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Get deregistration breakdown by category for a specific month
 */
export const getDeregistrationsByCategory = async (month: string) => {
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
};

/**
 * Get deregistration data for a specific month
 */
export const getDeregistrationsByMonth = async (month: string) => {
  "use cache";
  cacheLife("max");
  cacheTag(`deregistrations:month:${month}`);

  return db
    .select()
    .from(deregistrations)
    .where(eq(deregistrations.month, month))
    .orderBy(desc(deregistrations.number));
};
