import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const coe = pgTable(
  "coe",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    month: text("month").notNull(),
    bidding_no: integer("bidding_no"),
    vehicle_class: text("vehicle_class").notNull(),
    quota: integer("quota").default(0),
    bids_success: integer("bids_success").default(0),
    bids_received: integer("bids_received").default(0),
    premium: integer("premium").default(0),
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
    month: text("month").notNull(),
    vehicle_class: text("vehicle_class").notNull(),
    pqp: integer("pqp").default(0),
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
