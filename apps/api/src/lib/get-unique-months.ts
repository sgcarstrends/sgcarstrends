import { db } from "@sgcarstrends/database";
import { desc, type Table } from "drizzle-orm";

export const getUniqueMonths = async (table: Table, key = "month") => {
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
