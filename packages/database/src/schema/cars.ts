import { index, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const cars = pgTable(
  "cars",
  {
    id: uuid().defaultRandom().primaryKey(),
    month: text().notNull(),
    make: text().notNull(),
    importerType: text(),
    fuelType: text().notNull(),
    vehicleType: text().notNull(),
    number: integer().default(0),
  },
  (table) => [
    index().on(table.month, table.make),
    index().on(table.month),
    index().on(table.make),
    index().on(table.fuelType),
    index().on(table.make, table.fuelType),
    index().on(table.number),
  ],
);

export type InsertCar = typeof cars.$inferInsert;
export type SelectCar = typeof cars.$inferSelect;
