import { db } from "@api/config/db";
import { coe } from "@sgcarstrends/database";
import { and, asc, desc, eq } from "drizzle-orm";

export const getCoeForMonth = async (month: string) =>
  db.query.coe.findMany({
    columns: { id: false },
    where: eq(coe.month, month),
    orderBy: [asc(coe.bidding_no), asc(coe.vehicle_class)],
  });

export const getCoeLatestMonth = () =>
  db.query.coe.findFirst({ orderBy: desc(coe.month) });

export const getLatestCoeResult = async ({ month, biddingNo }) =>
  db
    .select()
    .from(coe)
    .where(and(eq(coe.month, month), eq(coe.bidding_no, biddingNo)))
    .orderBy(asc(coe.vehicle_class));
