import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { advertisers } from "./advertisers";
import { campaignEvents } from "./campaign-events";

export const campaigns = pgTable(
  "campaigns",
  {
    id: uuid().primaryKey().defaultRandom(),
    advertiserId: uuid()
      .notNull()
      .references(() => advertisers.id, { onDelete: "cascade" }),
    name: text().notNull(),
    placementType: text().notNull(),
    imageUrl: text().notNull(),
    destinationUrl: text().notNull(),
    altText: text(),
    plan: text().notNull(),
    startDate: timestamp().notNull(),
    endDate: timestamp().notNull(),
    status: text().default("draft").notNull(),
    impressions: integer().default(0).notNull(),
    clicks: integer().default(0).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("campaigns_advertiserId_idx").on(table.advertiserId),
    index("campaigns_status_idx").on(table.status),
    index("campaigns_placementType_idx").on(table.placementType),
    index("campaigns_active_idx").on(
      table.status,
      table.placementType,
      table.startDate,
      table.endDate,
    ),
  ],
);

export type InsertCampaign = typeof campaigns.$inferInsert;
export type SelectCampaign = typeof campaigns.$inferSelect;

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  advertiser: one(advertisers, {
    fields: [campaigns.advertiserId],
    references: [advertisers.id],
  }),
  events: many(campaignEvents),
}));
