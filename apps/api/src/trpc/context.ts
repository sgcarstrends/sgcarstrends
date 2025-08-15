import { db } from "@api/config/db";
import type { Context } from "hono";

export type TRPCContext = {
  db: typeof db;
  auth?: string;
};

export const createTRPCContext = (c: Context): TRPCContext => ({
  db,
  auth: c.req.header("authorization"),
});
