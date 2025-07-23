import { CACHE_TTL } from "@api/config";
import { neon } from "@neondatabase/serverless";
import * as schema from "@sgcarstrends/database";
import { upstashCache } from "drizzle-orm/cache/upstash";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, {
  cache: upstashCache({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    global: true,
    config: { ex: CACHE_TTL },
  }),
  schema,
});
