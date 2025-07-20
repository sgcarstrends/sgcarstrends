import db from "@api/config/db";
import { getUniqueMonths } from "@api/lib/getUniqueMonths";
import { groupMonthsByYear } from "@api/lib/groupMonthsByYear";
import {
  COELatestResponseSchema,
  COEPQPResponseSchema,
  COEQuerySchema,
  MonthsQuerySchema,
  MonthsResponseSchema,
} from "@api/schemas";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { coe, coePQP } from "@sgcarstrends/database";
import { and, asc, desc, eq, gte, inArray, lte, max } from "drizzle-orm";

const app = new OpenAPIHono();

app.openapi(
  createRoute({
    method: "get",
    path: "/",
    summary: "COE bidding results",
    description:
      "Get Certificate of Entitlement (COE) bidding results, optionally filtered by month or date range",
    tags: ["COE"],
    request: {
      query: COEQuerySchema,
    },
    responses: {
      200: {
        description: "COE bidding results",
        content: {
          "application/json": {
            schema: COELatestResponseSchema,
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
    const { month, start, end } = query;

    const filters = [
      month && eq(coe.month, month),
      start && gte(coe.month, start),
      end && lte(coe.month, end),
    ];

    const results = await db
      .select()
      .from(coe)
      .where(and(...filters))
      .orderBy(desc(coe.month), asc(coe.bidding_no), asc(coe.vehicle_class));

    return c.json(results);
  },
);

app.openapi(
  createRoute({
    method: "get",
    path: "/months",
    summary: "Get available COE months",
    description:
      "Get a list of all available months with COE bidding data, optionally grouped by year",
    tags: ["COE"],
    request: {
      query: MonthsQuerySchema,
    },
    responses: {
      200: {
        description: "List of available months",
        content: {
          "application/json": {
            schema: MonthsResponseSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    const { grouped } = c.req.query();

    const months = await getUniqueMonths(coe);
    if (grouped) {
      return c.json(groupMonthsByYear(months));
    }

    return c.json(months);
  },
);

app.openapi(
  createRoute({
    method: "get",
    path: "/latest",
    summary: "Get latest COE results",
    description:
      "Get the most recent COE bidding results from the latest available month",
    tags: ["COE"],
    responses: {
      200: {
        description: "Latest COE bidding results",
        content: {
          "application/json": {
            schema: COELatestResponseSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    const [{ latestMonth }] = await db
      .select({ latestMonth: max(coe.month) })
      .from(coe);
    const results = await db
      .select()
      .from(coe)
      .where(
        and(
          eq(coe.month, latestMonth),
          inArray(
            coe.bidding_no,
            db
              .select({ bidding_no: max(coe.bidding_no) })
              .from(coe)
              .where(eq(coe.month, latestMonth)),
          ),
        ),
      )
      .orderBy(desc(coe.bidding_no), asc(coe.vehicle_class));

    return c.json(results);
  },
);

app.openapi(
  createRoute({
    method: "get",
    path: "/pqp",
    summary: "COE Prevailing Quota Premium rates",
    description:
      "Get COE Prevailing Quota Premium (PQP) rates grouped by month and vehicle class",
    tags: ["COE"],
    responses: {
      200: {
        description: "COE Prevailing Quota Premium rates",
        content: {
          "application/json": {
            schema: COEPQPResponseSchema,
          },
        },
      },
      500: {
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    const results = await db
      .select()
      .from(coePQP)
      .orderBy(desc(coePQP.month), asc(coePQP.vehicle_class));

    const pqpRates = results.reduce(
      (grouped, { month, vehicle_class, pqp }) => {
        if (!grouped[month]) {
          grouped[month] = {};
        }
        grouped[month][vehicle_class] = pqp;
        return grouped;
      },
      {},
    );

    return c.json(pqpRates);
  },
);

export default app;
