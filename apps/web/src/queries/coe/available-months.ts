import { coe, db } from "@sgcarstrends/database";
import { desc } from "drizzle-orm";

export const getCoeMonths = async (): Promise<{ month: string }[]> => {
  const results = await db
    .selectDistinct({ month: coe.month })
    .from(coe)
    .orderBy(desc(coe.month));

  return results.map(({ month }) => ({ month }));
};
