import { coe, db } from "@sgcarstrends/database";
import { CACHE_TAG } from "@web/lib/cache";
import { desc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export const getCoeMonths = async (): Promise<{ month: string }[]> => {
  const results = await db
    .selectDistinct({ month: coe.month })
    .from(coe)
    .orderBy(desc(coe.month));

  return results.map(({ month }) => ({ month }));
};
