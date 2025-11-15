import { z } from "@hono/zod-openapi";

const serviceSchema = z.object({
  status: z.string(),
  responseTime: z.number().default(0),
  error: z.union([z.instanceof(Error), z.string()]).optional(),
});

export const healthServicesSchema = z.object({
  database: serviceSchema,
  redis: serviceSchema,
});

export const healthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string().datetime(),
  version: z.string(),
  uptime: z.number(),
  services: healthServicesSchema,
  responseTime: z.number(),
});
