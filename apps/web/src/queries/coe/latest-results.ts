import { coe, db } from "@sgcarstrends/database";
import type { COEResult } from "@web/types";
import { and, asc, desc, eq, inArray, max } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export const getLatestCOEResults = async (): Promise<COEResult[]> => {
  "use cache";
  cacheLife("latestData");
  cacheTag("coe", "latest-coe");

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
          coe.bidding_no,
          db
            .select({ bidding_no: max(coe.bidding_no) })
            .from(coe)
            .where(eq(coe.month, latestMonth)),
        ),
      ),
    )
    .orderBy(desc(coe.bidding_no), asc(coe.vehicle_class));

  return results as COEResult[];
};
