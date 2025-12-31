import { redis } from "@sgcarstrends/utils";
import { Realtime } from "@upstash/realtime";
import { realtimeSchema } from "@web/lib/realtime/schema";

export const realtime = new Realtime({
  schema: realtimeSchema,
  redis,
});
