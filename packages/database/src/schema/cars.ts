import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const cars = pgTable(
  "cars",
  {
    id: uuid().defaultRandom().primaryKey(),
    month: text(),
    make: text(),
    importerType: text(),
    fuelType: text(),
    vehicleType: text(),
    number: integer(),
  },
  (table) => [
    index("month_make_idx").on(table.month, table.make),
    index("month_idx").on(table.month),
    index("make_idx").on(table.make),
    index("fuel_type_idx").on(table.fuelType),
    index("make_fuel_type_idx").on(table.make, table.fuelType),
    index("number_idx").on(table.number),
  ],
);

export type InsertCar = typeof cars.$inferInsert;
export type SelectCar = typeof cars.$inferSelect;
