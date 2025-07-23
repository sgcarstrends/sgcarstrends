import { db } from "@api/config/db";
import redis from "@api/config/redis";
import type { Context } from "hono";
import { Resource } from "sst";

export type TRPCContext = {
  db: typeof db;
  redis: typeof redis;
  isAuthenticated: boolean;
};

export const createTRPCContext = async (
  _: unknown,
  c: Context,
): Promise<TRPCContext> => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader?.split(" ")[1];
  const isAuthenticated = token === Resource.SG_CARS_TRENDS_API_TOKEN.value;

  return {
    db,
    redis,
    isAuthenticated,
  };
};
