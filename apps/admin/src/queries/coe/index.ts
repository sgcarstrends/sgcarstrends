import { coe, db } from "@sgcarstrends/database";
import { asc, eq } from "drizzle-orm";

export const getCoeForMonth = async (month: string) => {
  return db.query.coe.findMany({
    columns: { id: false },
    where: eq(coe.month, month),
    orderBy: [asc(coe.bidding_no), asc(coe.vehicle_class)],
  });
};
