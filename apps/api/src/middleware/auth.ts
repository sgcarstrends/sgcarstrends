import { bearerAuth } from "hono/bearer-auth";

export const authMiddleware = bearerAuth({
  token: process.env.SG_CARS_TRENDS_API_TOKEN as string,
});
