import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { campaigns } from "./campaigns";

export const advertisers = pgTable(
  "advertisers",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyName: text().notNull(),
    contactName: text().notNull(),
    contactEmail: text().notNull(),
    website: text(),
    status: text().default("active").notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("advertisers_userId_idx").on(table.userId),
    index("advertisers_status_idx").on(table.status),
  ],
);

export type InsertAdvertiser = typeof advertisers.$inferInsert;
export type SelectAdvertiser = typeof advertisers.$inferSelect;

export const advertisersRelations = relations(advertisers, ({ one, many }) => ({
  user: one(users, {
    fields: [advertisers.userId],
    references: [users.id],
  }),
  campaigns: many(campaigns),
}));
