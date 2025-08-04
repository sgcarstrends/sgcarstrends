import db from "@api/config/db";
import type { Context } from "hono";

export type TRPCContext = {
  db: typeof db;
  auth?: string;
  env: any;
};

export const createTRPCContext = (c: Context): TRPCContext => ({
  db,
  auth: c.req.header("authorization"),
  env: c.env,
});
