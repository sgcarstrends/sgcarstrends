import { coe, db } from "@sgcarstrends/database";
import { asc, desc, eq } from "drizzle-orm";

export const getCoeForMonth = async (month: string) =>
  db.query.coe.findMany({
    columns: { id: false },
    where: eq(coe.month, month),
    orderBy: [asc(coe.bidding_no), asc(coe.vehicle_class)],
  });

export const getCoeLatestMonth = () =>
  db.query.coe.findFirst({ orderBy: desc(coe.month) });
