import { db, deregistrations } from "@sgcarstrends/database";
import { desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Get available months in descending order (for dropdowns/selectors)
 */
export const getDeregistrationsAvailableMonths = async () => {
  "use cache";
  cacheLife("max");
  cacheTag("deregistrations:months");

  return db
    .selectDistinct({ month: deregistrations.month })
    .from(deregistrations)
    .orderBy(desc(deregistrations.month));
};
