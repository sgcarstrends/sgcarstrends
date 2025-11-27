import { coe, db } from "@sgcarstrends/database";
import type { COEResult } from "@web/types";
import { and, asc, desc, eq, inArray, max } from "drizzle-orm";

export const getLatestCoeResults = async (): Promise<COEResult[]> => {
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
