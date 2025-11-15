import { coe, db } from "@sgcarstrends/database";
import { CACHE_LIFE, CACHE_TAG } from "@web/lib/cache";
import type { COEResult } from "@web/types";
import { and, asc, desc, eq, inArray, max } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export const getLatestCoeResults = async (): Promise<COEResult[]> => {
  "use cache";
  cacheLife(CACHE_LIFE.latestData);
  cacheTag(...CACHE_TAG.coe.latestResults());

  const [{ latestMonth }] = await db
    .select({ latestMonth: max(coe.month) })
    .from(coe);

  if (!latestMonth) {
    return [];
  }

  const results = await db
    .select()
    .from(coe)
    .where(
      and(
        eq(coe.month, latestMonth),
        inArray(
          coe.biddingNo,
          db
            .select({ biddingNo: max(coe.biddingNo) })
            .from(coe)
            .where(eq(coe.month, latestMonth)),
        ),
      ),
    )
    .orderBy(desc(coe.biddingNo), asc(coe.vehicleClass));

  return results as COEResult[];
};
