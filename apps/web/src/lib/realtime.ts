import { type InferSchema, Realtime } from "@upstash/realtime";
import { z } from "zod";
import { redis } from "./redis";

const workflowEnum = z.enum(["cars", "coe", "deregistrations", "newsletter"]);

const schema = {
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

export const realtime = new Realtime({
  schema,
  redis,
  maxDurationSecs: 300,
  history: {
    maxLength: 50,
    expireAfterSecs: 3600, // 1 hour
  },
});

export type RealtimeEvents = InferSchema<typeof schema>;
