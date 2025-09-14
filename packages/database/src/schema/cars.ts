import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const cars = pgTable(
  "cars",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    month: text("month"),
    make: text("make"),
    importer_type: text("importer_type"),
    fuel_type: text("fuel_type"),
    vehicle_type: text("vehicle_type"),
    number: integer("number"),
  },
  (table) => [
    index("month_make_idx").on(table.month, table.make),
    index("month_idx").on(table.month),
    index("make_idx").on(table.make),
    index("fuel_type_idx").on(table.fuel_type),
    index("make_fuel_type_idx").on(table.make, table.fuel_type),
    index("number_idx").on(table.number),
  ],
);

export type InsertCar = typeof cars.$inferInsert;
export type SelectCar = typeof cars.$inferSelect;
