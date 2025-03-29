import { CACHE_TTL } from "@api/config";
import db from "@api/config/db";
import redis from "@api/config/redis";
import { getUniqueMonths } from "@api/lib/getUniqueMonths";
import { groupMonthsByYear } from "@api/lib/groupMonthsByYear";
import { CarQuerySchema, MonthsQuerySchema } from "@api/schemas";
import type { Make } from "@api/types";
import { buildFilters, fetchCars } from "@api/v1/service/car.service";
import { zValidator } from "@hono/zod-validator";
import { cars } from "@sgcarstrends/schema";
import { asc } from "drizzle-orm";
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
