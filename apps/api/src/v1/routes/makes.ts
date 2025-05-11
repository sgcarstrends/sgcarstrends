import db from "@api/config/db";
import { MakeParamSchema, MakeQuerySchema } from "@api/schemas";
import { zValidator } from "@hono/zod-validator";
import { cars } from "@sgcarstrends/schema";
import { and, asc, desc, eq, ilike } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const makes = await db
    .selectDistinct({ make: cars.make })
    .from(cars)
    .orderBy(asc(cars.make))
    .then((res) => res.map(({ make }) => make));

  return c.json(makes);
});

app.get(
  "/:make",
  zValidator("param", MakeParamSchema),
  zValidator("query", MakeQuerySchema),
  async (c) => {
    try {
      const param = c.req.valid("param");
      const { make } = param;
      const query = c.req.valid("query");
      const { month, fuel_type, vehicle_type } = query;

      const filters = [
        ilike(cars.make, make.split("-").join("%")),
        month && eq(cars.month, month),
        fuel_type && ilike(cars.fuel_type, fuel_type.split("-").join("%")),
        vehicle_type &&
          ilike(cars.vehicle_type, vehicle_type.split("-").join("%")),
      ].filter(Boolean);

      const results = await db
        .select()
        .from(cars)
        .where(and(...filters))
        .orderBy(desc(cars.month), asc(cars.fuel_type), asc(cars.vehicle_type));

      return c.json(results);
    } catch (e) {
      console.error(e);
      return c.json({ error: e.message }, 500);
    }
  },
);

export default app;
