import db from "@api/config/db";
import { getUniqueMonths } from "@api/lib/getUniqueMonths";
import { groupMonthsByYear } from "@api/lib/groupMonthsByYear";
import {
  CarQuerySchema,
  CarsRegistrationQuerySchema,
  ComparisonQuerySchema,
  MonthsQuerySchema,
} from "@api/schemas";
import { successResponse } from "@api/utils/responses";
import {
  buildFilters,
  fetchCars,
  getCarMetricsForPeriod,
} from "@api/v1/service/car.service";
import { zValidator } from "@hono/zod-validator";
import { cars } from "@sgcarstrends/schema";
import { and, asc, eq, ne, sum } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono();

app.get("/", zValidator("query", CarQuerySchema), async (c) => {
  const query = c.req.query();

  try {
    const filters = await buildFilters(query);
    const results = await fetchCars(filters);

    return c.json(results);
  } catch (e) {
    console.error("Car query error:", e);
    return c.json(
      {
        error: "An error occurred while fetching cars",
        details: e.message,
      },
      500,
    );
  }
});

app.get(
  "/registration",
  zValidator("query", CarsRegistrationQuerySchema),
  async (c) => {
    const { month } = c.req.query();

    const nonZeroInNumber = and(eq(cars.month, month), ne(cars.number, 0));

    const [getByFuelType, getByVehicleType, totalRecords] = await db.batch([
      db
        .select({ fuelType: cars.fuel_type, total: sum(cars.number) })
        .from(cars)
        .where(nonZeroInNumber)
        .groupBy(cars.fuel_type),
      db
        .select({ vehicleType: cars.vehicle_type, total: sum(cars.number) })
        .from(cars)
        .where(nonZeroInNumber)
        .groupBy(cars.vehicle_type),
      db
        .select({ total: sum(cars.number) })
        .from(cars)
        .where(nonZeroInNumber)
        .limit(1),
    ]);

    const fuelType = Object.fromEntries(
      getByFuelType.map(({ fuelType, total }) => [fuelType, Number(total)]),
    );

    const vehicleType = Object.fromEntries(
      getByVehicleType.map(({ vehicleType, total }) => [
        vehicleType,
        Number(total),
      ]),
    );

    const total = Number(totalRecords[0].total ?? 0);
    return successResponse(c, { month, fuelType, vehicleType, total });
  },
);

app.get("/compare", zValidator("query", ComparisonQuerySchema), async (c) => {
  const { month } = c.req.query();

  try {
    const metrics = await getCarMetricsForPeriod(month);
    return c.json(metrics);
  } catch (e) {
    console.error("Error fetching car metrics:", e);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/months", zValidator("query", MonthsQuerySchema), async (c) => {
  const { grouped } = c.req.query();

  const months = await getUniqueMonths(cars);
  if (grouped) {
    return c.json(groupMonthsByYear(months));
  }

  return c.json(months);
});

app.get("/makes", async (c) => {
  const makes = await db
    .selectDistinct({ make: cars.make })
    .from(cars)
    .orderBy(asc(cars.make))
    .then((res) => res.map(({ make }) => make));

  return c.json(makes);
});

export default app;
