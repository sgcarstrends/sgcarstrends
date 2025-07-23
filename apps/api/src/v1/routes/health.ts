import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { healthResponseSchema } from "@api/schemas/health";
import { performHealthCheck } from "@api/utils/health";

const app = new OpenAPIHono();

app.openapi(
  createRoute({
    method: "get",
    path: "/",
    summary: "Health check endpoint",
    description:
      "Get the health status of the API and its dependencies (database and Redis)",
    tags: ["Health"],
    responses: {
      200: {
        description: "Service is healthy",
        content: {
          "application/json": {
            schema: healthResponseSchema,
          },
        },
      },
      503: {
        description: "Service is unhealthy",
        content: {
          "application/json": {
            schema: healthResponseSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const healthResponse = await performHealthCheck();
    return c.json(healthResponse, healthResponse.status === "healthy" ? 200 : 503);
  },
);

export default app;
