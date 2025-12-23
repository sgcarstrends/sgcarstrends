import type { InferSchema } from "@upstash/realtime";
import { z } from "zod";

export const workflowEnum = z.enum([
  "cars",
  "coe",
  "deregistrations",
  "newsletter",
]);

export const realtimeSchema = {
  workflow: {
    started: z.object({
      workflow: workflowEnum,
      message: z.string(),
    }),
    completed: z.object({
      workflow: workflowEnum,
      message: z.string(),
      recordsProcessed: z.number().optional(),
      month: z.string().optional(),
    }),
    failed: z.object({
      workflow: workflowEnum,
      message: z.string(),
      error: z.string().optional(),
    }),
  },
};

export type WorkflowName = z.infer<typeof workflowEnum>;
export type RealtimeEvents = InferSchema<typeof realtimeSchema>;
