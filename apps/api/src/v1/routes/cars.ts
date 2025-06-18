import { cars } from "@api/db/schema";
import { getUniqueMonths } from "@api/lib/getUniqueMonths";
import { groupMonthsByYear } from "@api/lib/groupMonthsByYear";
import {
  checkMakeIfExist,
  getCarRegistrationByMonth,
  getCarsByFuelType,
  getCarsByVehicleType,
  getCarsTopMakesByFuelType,
  getDistinctFuelTypes,
  getDistinctMakes,
  getDistinctVehicleTypes,
  getFuelTypeByMonth,
  getMake,
  getTopTypes,
  getVehicleTypeByMonth,
} from "@api/queries/cars";
import {
  CarQuerySchema,
  CarResponseSchema,
  CarsByTypeSchema,
  ComparisonQuerySchema,
  ComparisonResponseSchema,
  MakeParamSchema,
  MakeQuerySchema,
  MakeResponseSchema,
  MakesResponseSchema,
  MonthsQuerySchema,
  TopMakesQuerySchema,
  TopMakesResponseSchema,
  TopTypesQuerySchema,
  TopTypesResponseSchema,
} from "@api/schemas";
import { getCarMetricsForPeriod } from "@api/v1/service/car.service";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { zValidator } from "@hono/zod-validator";

const app = new OpenAPIHono();

app.openapi(
  createRoute({
    method: "get",
    path: "/",
    summary: "Car registration data by month",
    description:
      "Get car registration data filtered by various parameters. When month is provided, returns aggregated data by fuel type and vehicle type.",
    tags: ["Cars"],
    request: { query: CarQuerySchema },
    responses: {
      200: {
        description: "Car registration data",
        content: {
          "application/json": {
            schema: z.union([CarResponseSchema, CarsByTypeSchema]),
          },
        },
      },
      500: {
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    const query = c.req.query();
    const { month } = query;

    try {
      if (month) {
        const [{ total }] = await getCarRegistrationByMonth(month);
        const fuelType = await getCarsByFuelType(month);
        const vehicleType = await getCarsByVehicleType(month);
        const data = { month, total, fuelType, vehicleType };
        return c.json(data);
      }

      return c.json(null);
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
  },
);

app.get("/fuel-types", async (c) => {
  const { month } = c.req.query();

  const result = await getDistinctFuelTypes(month);
  const fuelTypes = result.map(({ fuelType }) => fuelType);
  return c.json(fuelTypes);
});

app.get("/fuel-types/:fuelType", async (c) => {
  const { fuelType } = c.req.param();
  const { month } = c.req.query();

  const [totalResult, result] = await getFuelTypeByMonth(fuelType, month);

  return c.json({ total: totalResult[0].total, data: result });
});

app.get("/vehicle-types", async (c) => {
  const { month } = c.req.query();

  const result = await getDistinctVehicleTypes(month);
  const vehicleTypes = result.map(({ vehicleType }) => vehicleType);
  return c.json(vehicleTypes);
});

app.get("/vehicle-types/:vehicleType", async (c) => {
  const { vehicleType } = c.req.param();
  const { month } = c.req.query();

  const [totalResult, result] = await getVehicleTypeByMonth(vehicleType, month);

  return c.json({ total: totalResult[0].total, data: result });
});

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

      return c.json({
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

app.openapi(
  createRoute({
    method: "get",
    path: "/top-makes",
    summary: "Top makes by fuel type for a month",
    description:
      "Get the top 3 car makes for each fuel type based on registration numbers for a specific month",
    tags: ["Cars"],
    request: { query: TopMakesQuerySchema },
    responses: {
      200: {
        description: "Top makes grouped by fuel type for the month",
        content: {
          "application/json": {
            schema: TopMakesResponseSchema,
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
      const result = await getCarsTopMakesByFuelType(month);
      return c.json(result);
    } catch (e) {
      console.error("Error fetching top makes:", e);
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

app.openapi(
  createRoute({
    method: "get",
    path: "/makes",
    summary: "Get all car makes",
    description: "Get a list of all available car manufacturers",
    tags: ["Cars"],
    responses: {
      200: {
        description: "List of car makes",
        content: {
          "application/json": {
            schema: MakesResponseSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    const result = await getDistinctMakes();
    const makes = result.map(({ make }) => make);
    return c.json(makes);
  },
);

app.openapi(
  createRoute({
    method: "get",
    path: "/makes/{make}",
    summary: "Get car data for a specific make",
    description:
      "Get car registration data for a specific make, optionally filtered by month",
    tags: ["Cars"],
    request: {
      params: MakeParamSchema,
      query: MakeQuerySchema,
    },
    responses: {
      200: {
        description: "Car data for the specified make",
        content: {
          "application/json": {
            schema: MakeResponseSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    const { make } = c.req.valid("param");
    const { month } = c.req.valid("query");

    const makeExists = await checkMakeIfExist(make);
    if (!makeExists) {
      return c.json({ error: "Make not found" }, 404);
    }

    const { total, data } = await getMake(makeExists.make, month);

    return c.json({
      make: makeExists.make,
      total,
      data,
    });
  },
);

export default app;
