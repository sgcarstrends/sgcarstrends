import { db } from "@sgcarstrends/database";
import { desc } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

export const getUniqueMonths = async <T extends PgTable>(
  table: T,
  key = "month",
) => {
  try {
    const results = await db
      .selectDistinct({ month: table[key] })
      .from(table)
      .orderBy(desc(table[key]));

    return results.map(({ month }) => month);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
