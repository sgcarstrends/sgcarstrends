import { z } from "@hono/zod-openapi";

// Common schemas
export const MonthSchema = z.string().regex(/^\d{4}-\d{2}$/); // YYYY-MM format

// Query schemas
export const LatestMonthQuerySchema = z
  .object({
    type: z.enum(["cars", "coe"]).optional(),
  })
  .strict();

// Response schemas
export const LatestMonthResponseSchema = z
  .object({
    cars: MonthSchema.optional(),
    coe: MonthSchema.optional(),
  })
  .strict();

// Type exports
export type LatestMonthQuery = z.infer<typeof LatestMonthQuerySchema>;
export type LatestMonthResponse = z.infer<typeof LatestMonthResponseSchema>;
