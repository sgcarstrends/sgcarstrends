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
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    slug: text().notNull().unique(),
    content: text().notNull(),
    excerpt: text(),
    tags: text().array(),
    highlights: jsonb(),
    status: text().default("draft"),
    metadata: jsonb(),
    month: text(),
    dataType: text(),
    createdAt: timestamp().defaultNow().notNull(),
    modifiedAt: timestamp().defaultNow().notNull(),
    publishedAt: timestamp(),
  },
  (table) => [
    // Composite unique constraint to prevent duplicate posts for same month + dataType
    unique().on(table.month, table.dataType),
  ],
);

export type InsertPost = typeof posts.$inferInsert;
export type SelectPost = typeof posts.$inferSelect;
