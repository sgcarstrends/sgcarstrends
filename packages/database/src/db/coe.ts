import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const coe = pgTable(
  "coe",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    month: text("month"),
    bidding_no: integer("bidding_no"),
    vehicle_class: text("vehicle_class"),
    quota: integer("quota"),
    bids_success: integer("bids_success"),
    bids_received: integer("bids_received"),
    premium: integer("premium"),
  },
  (table) => [
    index("month_vehicle_idx").on(table.month, table.vehicle_class),
    index("vehicle_class_idx").on(table.vehicle_class),
    index("month_bidding_no_idx").on(table.month, table.bidding_no),
    index("premium_idx").on(table.premium),
    index("bids_idx").on(table.bids_success, table.bids_received),
    index("month_bidding_no_vehicle_class_idx").on(
      table.month.desc(),
      table.bidding_no.desc(),
      table.vehicle_class,
    ),
  ],
);

export const coePQP = pgTable(
  "coe_pqp",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    month: text("month"),
    vehicle_class: text("vehicle_class"),
    pqp: integer("pqp"),
  },
  (table) => [
    index("pqp_month_vehicle_class_idx").on(table.month, table.vehicle_class),
    index("pqp_vehicle_class_idx").on(table.vehicle_class),
    index("pqp_idx").on(table.pqp),
  ],
);

export type InsertCOE = typeof coe.$inferInsert;
export type SelectCOE = typeof coe.$inferSelect;

export type InsertCOEPQP = typeof coePQP.$inferInsert;
export type SelectCOEPQP = typeof coePQP.$inferSelect;
