import db from "@api/config/db";
import redis from "@api/config/redis";
import {
  healthResponseSchema,
  healthServicesSchema,
} from "@api/schemas/health";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import packageJson from "../../../package.json";

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
    const startTime = Date.now();
    const services = healthServicesSchema.parse({
      database: {
        status: "unknown",
        responseTime: 0,
      },
      redis: {
        status: "unknown",
        responseTime: 0,
      },
    });

    // Test database connectivity
    try {
      const dbStartTime = Date.now();
      await db.execute("SELECT 1");
      services.database = {
        status: "healthy",
        responseTime: Date.now() - dbStartTime,
      };
    } catch (error) {
      const dbResponseTime = Date.now() - startTime;
      services.database = {
        status: "unhealthy",
        responseTime: dbResponseTime,
        error:
          error instanceof Error ? error.message : "Unknown database error",
      };
    }

    // Test Redis connectivity
    try {
      const redisStartTime = Date.now();
      const pingResult = await redis.ping();
      services.redis = {
        status: pingResult === "PONG" ? "healthy" : "unhealthy",
        responseTime: Date.now() - redisStartTime,
      };
    } catch (error) {
      const redisResponseTime = Date.now() - startTime;
      services.redis = {
        status: "unhealthy",
        responseTime: redisResponseTime,
        error: error instanceof Error ? error.message : "Unknown Redis error",
      };
    }

    const totalResponseTime = Date.now() - startTime;
    const overallStatus =
      services.database.status === "healthy" &&
      services.redis.status === "healthy"
        ? "healthy"
        : "unhealthy";

    const healthResponse = healthResponseSchema.parse({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: packageJson.version,
      uptime: process.uptime(),
      services,
      responseTime: totalResponseTime,
    });

    return c.json(healthResponse, overallStatus === "healthy" ? 200 : 503);
  },
);

export default app;
