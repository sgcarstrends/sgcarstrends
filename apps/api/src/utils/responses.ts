import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export const successResponse = (
  c: Context,
  data: unknown,
  status: ContentfulStatusCode = 200,
) => {
  const response = { status, timestamp: new Date().toISOString(), data };
  return c.json(response, status);
};
