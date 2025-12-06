import { db, deregistrations } from "@sgcarstrends/database";
import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export const getDeregistrations = async () => {
  "use cache";
  cacheLife("max");
  cacheTag("deregistrations:months");

  return db.select().from(deregistrations).orderBy(asc(deregistrations.month));
};
