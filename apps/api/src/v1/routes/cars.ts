import db from "@api/config/db";
import { getUniqueMonths } from "@api/lib/getUniqueMonths";
import { groupMonthsByYear } from "@api/lib/groupMonthsByYear";
import { getTopTypes } from "@api/queries/cars";
import {
  CarQuerySchema,
  CarsRegistrationQuerySchema,
  ComparisonQuerySchema,
  ComparisonResponseSchema,
  MonthsQuerySchema,
  TopTypesQuerySchema,
  TopTypesResponseSchema,
} from "@api/schemas";
import { successResponse } from "@api/utils/responses";
import {
  buildFilters,
  fetchCars,
  getCarMetricsForPeriod,
} from "@api/v1/service/car.service";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";
import { cars } from "@sgcarstrends/schema";
import { and, asc, eq, ne, sum } from "drizzle-orm";

const app = new OpenAPIHono();

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

app.openapi(
  createRoute({
    method: "get",
    path: "/compare",
    summary: "Compare car registration metrics",
    description:
      "Get car registration metrics for a specific month compared to previous month and same month in previous year",
    tags: ["Cars"],
    request: { query: ComparisonQuerySchema },
    responses: {
      200: {
        description: "Car registration metrics comparison",
        content: {
          "application/json": {
            schema: ComparisonResponseSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    const { month } = c.req.query();

    try {
      const metrics = await getCarMetricsForPeriod(month);
      return c.json(metrics);
    } catch (e) {
      console.error("Error fetching car metrics:", e);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

app.openapi(
  createRoute({
    method: "get",
    path: "/top-types",
    summary: "Top fuel and vehicle type by month",
    description:
      "Get the most popular fuel type and vehicle type based on registration numbers for a specific month",
    tags: ["Cars"],
    request: { query: TopTypesQuerySchema },
    responses: {
      200: {
        description: "Top fuel and vehicle types for the month",
        content: {
          "application/json": {
            schema: TopTypesResponseSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    const { month } = c.req.query();

    try {
      const [fuelTypeResult, vehicleTypeResult] = await getTopTypes(month);

      const topFuelType = {
        name: fuelTypeResult[0].name,
        total: fuelTypeResult[0].total,
      };

      const topVehicleType = {
        name: vehicleTypeResult[0].name,
        total: vehicleTypeResult[0].total,
      };

      return successResponse(c, {
        month,
        topFuelType,
        topVehicleType,
      });
    } catch (e) {
      console.error("Error fetching top types:", e);
      return c.json({ error: "Internal server error" }, 500);
    }
  },
);

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
