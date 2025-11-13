import { createMonthsRoute } from "@api/features/shared";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { coe, db, pqp } from "@sgcarstrends/database";
import { and, asc, desc, eq, gte, inArray, lte, max } from "drizzle-orm";
import {
  COELatestResponseSchema,
  COEPQPResponseSchema,
  COEQuerySchema,
} from "./schemas";

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
      .orderBy(desc(coe.month), asc(coe.biddingNo), asc(coe.vehicleClass));

    return c.json(results);
  },
);

// Mount months route using shared factory
app.route("/", createMonthsRoute(coe, "COE"));

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
            coe.biddingNo,
            db
              .select({ biddingNo: max(coe.biddingNo) })
              .from(coe)
              .where(eq(coe.month, latestMonth)),
          ),
        ),
      )
      .orderBy(desc(coe.biddingNo), asc(coe.vehicleClass));

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
      .from(pqp)
      .orderBy(desc(pqp.month), asc(pqp.vehicleClass));

    const pqpRates = results.reduce((grouped, { month, vehicleClass, pqp }) => {
      if (!grouped[month]) {
        grouped[month] = {};
      }
      grouped[month][vehicleClass] = pqp;
      return grouped;
    }, {});

    return c.json(pqpRates);
  },
);

export const coeRoutes = app;
