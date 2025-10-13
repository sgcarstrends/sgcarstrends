import { getLatestMonth } from "@api/lib/getLatestMonth";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { cars, coe } from "@sgcarstrends/database";
import { LatestMonthQuerySchema, LatestMonthResponseSchema } from "./schemas";

const app = new OpenAPIHono();

const TABLES_MAP = {
  cars,
  coe,
} as const;

const TABLES = Object.keys(TABLES_MAP);

app.openapi(
  createRoute({
    method: "get",
    path: "/latest",
    summary: "Get latest month with data",
    description:
      "Get the latest month with available data for cars and/or COE, optionally filtered by type",
    tags: ["Months"],
    request: {
      query: LatestMonthQuerySchema,
    },
    responses: {
      200: {
        description: "Latest month with data",
        content: {
          "application/json": {
            schema: LatestMonthResponseSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    const { type } = c.req.query();

    const tablesToCheck = type && TABLES.includes(type) ? [type] : TABLES;

    const latestMonthObj = await Promise.all(
      tablesToCheck.map(async (tableType) => ({
        [tableType]: await getLatestMonth(TABLES_MAP[tableType]),
      })),
    ).then((results) => Object.assign({}, ...results));

    return c.json(latestMonthObj);
  },
);

export const monthsRoutes = app;
