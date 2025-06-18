import { CACHE_TTL } from "@api/config";
import { neon } from "@neondatabase/serverless";
import * as schema from "@sgcarstrends/schema";
import { upstashCache } from "drizzle-orm/cache/upstash";
import { drizzle } from "drizzle-orm/neon-http";
import { Resource } from "sst";

const sql = neon(Resource.DATABASE_URL.value);
export const db = drizzle(sql, {
  cache: upstashCache({
    url: Resource.UPSTASH_REDIS_REST_URL.value,
    token: Resource.UPSTASH_REDIS_REST_TOKEN.value,
    global: true,
    config: { ex: CACHE_TTL },
  }),
  schema,
});
