import { z } from "@hono/zod-openapi";

// Common schemas
export const MonthSchema = z.string().regex(/^\d{4}-\d{2}$/); // YYYY-MM format

// Query schemas
export const COEQuerySchema = z
  .object({
    sort: z.string().optional(),
    orderBy: z.string().optional(),
    month: MonthSchema.optional(),
    start: MonthSchema.optional(),
    end: MonthSchema.optional(),
  })
  .strict();

// Response schemas
export const COESchema = z.object({
  month: z.string(),
  bidding_no: z.number(),
  vehicle_class: z.string(),
  quota: z.number(),
  bids_received: z.number(),
  premium: z.number(),
});

export const COEResponseSchema = z.object({
  data: z.array(COESchema),
});

export const COEPQPResponseSchema = z.object({
  data: z.record(z.string(), z.record(z.string(), z.number())),
});

export const COELatestResponseSchema = z.array(COESchema);

// Type exports
export type COEQuery = z.infer<typeof COEQuerySchema>;
export type COE = z.infer<typeof COESchema>;
export type COEResponse = z.infer<typeof COEResponseSchema>;
export type COEPQPResponse = z.infer<typeof COEPQPResponseSchema>;
