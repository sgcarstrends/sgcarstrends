import { CACHE_TTL } from "@api/config";
import db from "@api/config/db";
import redis from "@api/config/redis";
import { getUniqueMonths } from "@api/lib/getUniqueMonths";
import { groupMonthsByYear } from "@api/lib/groupMonthsByYear";
import {
  CarQuerySchema,
  CarRegistrationQuerySchema,
  ComparisonQuerySchema,
  MonthsQuerySchema,
} from "@api/schemas";
import type { Make } from "@api/types";
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

  const CACHE_KEY = `cars:${JSON.stringify(query)}`;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    return c.json(cachedData);
  }

  try {
    const filters = await buildFilters(query);
    const results = await fetchCars(filters);

    await redis.set(CACHE_KEY, JSON.stringify(results), { ex: 86400 });

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
  zValidator("query", CarRegistrationQuerySchema),
  async (c) => {
    try {
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

      return c.json({
        status: 200,
        timestamp: new Date().toISOString(),
        data: { month, fuelType, vehicleType, total },
      });
    } catch (error) {
      console.error(error);

      const statusCode = error.status || error.statusCode || 500;

      return c.json(
        {
          status: statusCode,
          timestamp: new Date().toISOString(),
          error: {
            code: error.code || "UNKNOWN_ERROR",
            detail: error.message,
          },
          data: null,
        },
        statusCode,
      );
    }
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
  const CACHE_KEY = "makes";

  let makes = await redis.zrange<Make[]>(CACHE_KEY, 0, -1);
  if (makes.length === 0) {
    makes = await db
      .selectDistinct({ make: cars.make })
      .from(cars)
      .orderBy(asc(cars.make))
      .then((res) => res.map(({ make }) => make));

    for (const make of makes) {
      await redis.zadd(CACHE_KEY, { score: 0, member: make });
    }
    await redis.expire(CACHE_KEY, CACHE_TTL);
  }

  return c.json(makes);
});

export default app;
