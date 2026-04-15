import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { campaigns } from "./campaigns";

export const campaignEvents = pgTable(
  "campaign_events",
  {
    id: uuid().primaryKey().defaultRandom(),
    campaignId: uuid()
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    date: timestamp().notNull(),
    impressions: integer().default(0).notNull(),
    clicks: integer().default(0).notNull(),
  },
  (table) => [unique("campaign_events_unique").on(table.campaignId, table.date)],
);

export type InsertCampaignEvent = typeof campaignEvents.$inferInsert;
export type SelectCampaignEvent = typeof campaignEvents.$inferSelect;

export const campaignEventsRelations = relations(campaignEvents, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [campaignEvents.campaignId],
    references: [campaigns.id],
  }),
}));
