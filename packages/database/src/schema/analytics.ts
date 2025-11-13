import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const analyticsTable = pgTable("analytics", {
  id: serial().primaryKey(),
  date: timestamp({ withTimezone: true }).defaultNow(),
  pathname: text().notNull(),
  referrer: text(),
  country: text(),
  flag: text(),
  city: text(),
  latitude: text(),
  longitude: text(),
});

export type InsertAnalytics = typeof analyticsTable.$inferInsert;
export type SelectAnalytics = typeof analyticsTable.$inferSelect;
