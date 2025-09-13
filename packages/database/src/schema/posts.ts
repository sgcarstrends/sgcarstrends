import {
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(),
    metadata: jsonb("metadata"),
    month: text().notNull(),
    dataType: text().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    modifiedAt: timestamp("modified_at").defaultNow().notNull(),
    publishedAt: timestamp("published_at"),
  },
  (table) => ({
    // Composite unique constraint to prevent duplicate posts for same month + dataType
    uniqueMonthCategory: unique().on(table.month, table.dataType),
  }),
);

export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;
