import { Realtime } from "@upstash/realtime";
import { redis } from "../redis";
import { realtimeSchema } from "./schema";

export const realtime = new Realtime({
  schema: realtimeSchema,
  redis,
  maxDurationSecs: 300,
  history: {
    maxLength: 50,
    expireAfterSecs: 3600, // 1 hour
  },
});

export type { RealtimeEvents, WorkflowName } from "./schema";
export { realtimeSchema, workflowEnum } from "./schema";
