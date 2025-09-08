import { db } from "@api/config/db";
import {
  healthResponseSchema,
  healthServicesSchema,
} from "@api/schemas/health";
import { redis } from "@sgcarstrends/utils";
import packageJson from "../../package.json";

export async function performHealthCheck() {
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
      error: error instanceof Error ? error.message : "Unknown database error",
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

  return {
    healthResponse,
    isHealthy: overallStatus === "healthy",
  };
}
