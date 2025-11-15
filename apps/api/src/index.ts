import { healthRoutes } from "@api/features/health";
import { logosRoutes } from "@api/features/logos";
import { workflowRoutes } from "@api/features/workflows";
import { createTRPCContext } from "@api/trpc/context";
import { appRouter } from "@api/trpc/router";
import v1 from "@api/v1";
import { trpcServer } from "@hono/trpc-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
// import { Ratelimit } from "@upstash/ratelimit";
import { handle } from "hono/aws-lambda";
import { bearerAuth } from "hono/bearer-auth";
import { compress } from "hono/compress";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import packageJson from "../package.json" with { type: "json" };

// const ratelimit = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(10, "10 s"),
//   analytics: true,
// });

const app = new Hono();
const api = new OpenAPIHono();

// const rateLimitMiddleware = async (c, next) => {
//   const ip = c.req.header("x-forwarded-for") || "unknown";
//   const { success, limit, remaining, reset } = await ratelimit.limit(ip);
//
//   c.header("X-RateLimit-Limit", limit.toString());
//   c.header("X-RateLimit-Remaining", remaining.toString());
//   c.header("X-RateLimit-Reset", reset.toString());
//
//   if (!success) {
//     return c.text("Rate limit exceeded", 429);
//   }
//
//   await next();
// };

api.use(logger());
api.use(compress());
api.use(prettyJSON());
// if (process.env.FEATURE_FLAG_RATE_LIMIT) {
//   app.use("*", rateLimitMiddleware);
// }
// app.use("*", (c, next) => {
//   c.res.headers.append("Cache-Control", "public, max-age=86400");
//   return next();
// });

api.onError((error, c) => {
  if (error instanceof HTTPException) {
    // Use the original exception's status code
    return c.json(
      {
        status: error.status,
        timestamp: new Date().toISOString(),
        error: { message: error.message },
        data: null,
      },
      error.status,
    );
  }

  // Fallback for unexpected errors
  console.error(error);
  return c.json(
    {
      status: 500,
      timestamp: new Date().toISOString(),
      error: { message: "Internal Server Error" },
      data: null,
    },
    500,
  );
});

api.notFound((c) =>
  c.json({ message: `Resource not found: ${c.req.path}` }, 404),
);

api.doc("/docs", {
  openapi: "3.1.0",
  info: {
    version: packageJson.version,
    title: "SG Cars Trends API",
    description: packageJson.description,
  },
});

api.get("/", Scalar({ url: "/docs" }));

// Add tRPC middleware with authentication
api.use(
  "/trpc/*",
  bearerAuth({ token: process.env.SG_CARS_TRENDS_API_TOKEN as string }),
  trpcServer({
    router: appRouter,
    createContext: (_, c) => createTRPCContext(c),
  }),
);

api.route("/workflows", workflowRoutes);
api.route("/health", healthRoutes);
api.route("/logos", logosRoutes);
api.route("/v1", v1);

app.route("/", api);

export const handler = handle(app);

export default app;
