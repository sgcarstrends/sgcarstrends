import { coe, db } from "@sgcarstrends/database";
import type { COEResult } from "@web/types";
import { asc, eq, max } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export interface MonthBiddingRounds {
  month: string;
  firstRound: COEResult[];
  secondRound: COEResult[];
}

/**
 * Get both bidding rounds for the latest month.
 * Returns 1st and 2nd round data separately, with secondRound being empty
 * if the 2nd bidding hasn't occurred yet.
 */
export const getMonthBiddingRounds = async (): Promise<MonthBiddingRounds> => {
  "use cache";
  cacheLife("max");
  cacheTag("coe:latest", "coe:bidding-rounds");

  // Get the latest month
  const [latestMonthResult] = await db
    .select({ month: max(coe.month) })
    .from(coe);

  const latestMonth = latestMonthResult?.month;

  if (!latestMonth) {
    return { month: "", firstRound: [], secondRound: [] };
  }

  // Get all results for the latest month (both rounds)
  const monthResults = await db
    .select()
    .from(coe)
    .where(eq(coe.month, latestMonth))
    .orderBy(asc(coe.biddingNo), asc(coe.vehicleClass));

  // Split by bidding round
  const firstRound = monthResults.filter(
    (r) => r.biddingNo === 1,
  ) as COEResult[];
  const secondRound = monthResults.filter(
    (r) => r.biddingNo === 2,
  ) as COEResult[];

  return {
    month: latestMonth,
    firstRound,
    secondRound,
  };
};
