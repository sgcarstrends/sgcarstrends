import { neon } from "@neondatabase/serverless";
import * as schema from "@sgcarstrends/database";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
