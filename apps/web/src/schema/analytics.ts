import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const analyticsTable = pgTable("analytics", {
  id: serial("id").primaryKey(),
  date: timestamp("date", { withTimezone: true }).defaultNow(),
  pathname: text("pathname").notNull(),
  referrer: text("referrer"),
  country: text("country"),
  flag: text("flag"),
  city: text("city"),
  latitude: text("latitude"),
  longitude: text("longitude"),
});

export type InsertAnalytics = typeof analyticsTable.$inferInsert;
export type SelectAnalytics = typeof analyticsTable.$inferSelect;
