import db from "@api/config/db";
import { coe } from "@sgcarstrends/database";
import { and, asc, desc, eq, inArray, max } from "drizzle-orm";

/**
 * Gets the latest COE bidding results from the most recent month
 * @returns Promise<COE[]> Latest COE data for the most recent month and bidding number
 */
export const getLatestCOEData = async () => {
  const [{ latestMonth }] = await db
    .select({ latestMonth: max(coe.month) })
    .from(coe);

  return db
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
};
