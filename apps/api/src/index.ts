import workflows from "@api/routes";
import health from "@api/v1/routes/health";
import { trpcServer } from "@hono/trpc-server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
// import { Ratelimit } from "@upstash/ratelimit";
import { handle } from "hono/aws-lambda";
import { compress } from "hono/compress";
import { showRoutes } from "hono/dev";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import packageJson from "../package.json";
// import redis from "./config/redis";
import { createTRPCContext } from "./trpc/context";
import { appRouter } from "./trpc/router";
import v1 from "./v1";

// const ratelimit = new Ratelimit({
//   redis,
//   limiter: Ratelimit.slidingWindow(10, "10 s"),
//   analytics: true,
// });

const app = new OpenAPIHono();

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

app.use(logger());
app.use(compress());
app.use(prettyJSON());
app.use(secureHeaders());
// if (process.env.FEATURE_FLAG_RATE_LIMIT) {
//   app.use("*", rateLimitMiddleware);
// }
// app.use("*", (c, next) => {
//   c.res.headers.append("Cache-Control", "public, max-age=86400");
//   return next();
// });

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: createTRPCContext,
  }),
);

app.onError((error, c) => {
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

app.notFound((c) =>
  c.json({ message: `Resource not found: ${c.req.path}` }, 404),
);

app.doc("/docs", {
  openapi: "3.1.0",
  info: {
    version: packageJson.version,
    title: "SG Cars Trends API",
    description: packageJson.description,
  },
});

app.get("/", Scalar({ url: "/docs" }));

app.route("/workflows", workflows);
app.route("/health", health);
app.route("/v1", v1);

showRoutes(app);

export const handler = handle(app);

export default app;
