import { db, deregistrations } from "@sgcarstrends/database";
import { max } from "drizzle-orm";

export const getDeregistrationsLatestMonth = async () => {
  const [result] = await db
    .select({ month: max(deregistrations.month) })
    .from(deregistrations);

  return result;
};
