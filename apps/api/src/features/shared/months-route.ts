import { getMonthsByYear } from "@api/lib/get-months-by-year";
import { getUniqueMonths } from "@api/lib/get-unique-months";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { PgTable } from "drizzle-orm/pg-core";

const MonthsQuerySchema = z.object({
  grouped: z.string().optional(),
});

const MonthsResponseSchema = z.union([
  z.array(z.string()),
  z.array(
    z.object({
      year: z.string(),
      months: z.array(z.string()),
    }),
  ),
]);

/**
 * Creates a standardized months listing route for a given table
 * @param table - Drizzle ORM table with a month column
 * @param tag - OpenAPI tag for the route (e.g., "Cars", "COE")
 * @param description - Optional custom description for the route
 * @returns Configured OpenAPIHono app with months route
 */
export const createMonthsRoute = <T extends PgTable>(
  table: T,
  tag: string,
  description?: string,
) => {
  const app = new OpenAPIHono();

  app.openapi(
    createRoute({
      method: "get",
      path: "/months",
      summary: `Get available ${tag.toLowerCase()} months`,
      description:
        description ||
        `Get a list of all available months with ${tag.toLowerCase()} data, optionally grouped by year`,
      tags: [tag],
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

      const months = await getUniqueMonths(table);
      if (grouped) {
        return c.json(getMonthsByYear(months));
      }

      return c.json(months);
    },
  );

  return app;
};
