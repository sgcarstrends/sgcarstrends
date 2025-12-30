import { db, deregistrations } from "@sgcarstrends/database";
import { asc } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

export async function getDeregistrations() {
  "use cache";
  cacheLife("max");
  cacheTag("deregistrations:months");

  return db.select().from(deregistrations).orderBy(asc(deregistrations.month));
}
