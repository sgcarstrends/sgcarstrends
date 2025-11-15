import { db } from "@sgcarstrends/database";
import { max, type Table } from "drizzle-orm";

export const getLatestMonth = async (table: Table): Promise<string> => {
  const key = "month";

  try {
    const [{ month }] = await db.select({ month: max(table[key]) }).from(table);

    if (!month) {
      console.warn(`No data found for table: ${table}`);
      return null;
    }

    return month;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
