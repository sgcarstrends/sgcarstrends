import { Hono } from "hono";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import logos from "@/api/routes/logos";
import type { Env } from "@/types/env";
import { logInfo } from "@/utils/logger";
import packageJson from "../package.json";

const app = new Hono<{ Bindings: Env }>();

app.use(cors());
app.use(etag());
app.use(logger());
app.use(prettyJSON());
app.use(requestId());
app.use(secureHeaders());

app.notFound((c) => {
  logInfo(`404 Not Found - ${c.req.method} ${c.req.url}`, {
    operation: "NOT_FOUND",
  });

  return c.json({ success: false, error: "Not found" }, 404);
});

app.get("/", (c) =>
  c.json({
    message: "Car Logos API",
    version: packageJson.version,
    endpoints: {
      "GET /logos": "List all cached logos",
      "GET /logos/:brand": "Get logo (download if not available)",
      "POST /logos/sync": "Synchronise KV metadata with R2 storage",
    },
  }),
);

app.route("/logos", logos);

export default app;
