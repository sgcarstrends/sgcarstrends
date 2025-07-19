import { coe } from "@api/db/schema";
import { db } from "@api/lib/workflows/db";
import { and, asc, desc, eq } from "drizzle-orm";

export const getCoeLatestMonth = () =>
  db.query.coe.findFirst({ orderBy: desc(coe.month) });

export const getLatestCoeResult = async ({ month, biddingNo }) =>
  db
    .select()
    .from(coe)
    .where(and(eq(coe.month, month), eq(coe.bidding_no, biddingNo)))
    .orderBy(asc(coe.vehicle_class));
