import { neon } from "@neondatabase/serverless";
import * as schema from "@sgcarstrends/database";
import { drizzle } from "drizzle-orm/neon-http";
import { Resource } from "sst";

const sql = neon(Resource.DATABASE_URL.value);
export const db = drizzle(sql, { schema });
