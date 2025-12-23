import { redis } from "@sgcarstrends/utils";
import { Realtime } from "@upstash/realtime";
import { z } from "zod";

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
});
