import { Hono } from "hono";

// Note: This is a placeholder for logos API routes
// The original implementation uses Cloudflare Workers R2 + KV storage
// which is not compatible with AWS Lambda deployment.
//
// TODO: Adapt storage layer to use one of:
// - Vercel Blob (as per issue #525 Phase 3)
// - AWS S3 + DynamoDB
// - HTTP API calls to R2 (if deployed separately)

const app = new Hono();

app.get("/", async (c) => {
  return c.json(
    {
      success: false,
      error: "Logos API not yet implemented - awaiting storage layer migration",
      message:
        "Original implementation uses Cloudflare R2 + KV. Needs adaptation for AWS Lambda deployment.",
    },
    501,
  );
});

app.get("/:brand", async (c) => {
  const brand = c.req.param("brand");

  return c.json(
    {
      success: false,
      error: "Logos API not yet implemented - awaiting storage layer migration",
      brand,
      message:
        "Original implementation uses Cloudflare R2 + KV. Needs adaptation for AWS Lambda deployment.",
    },
    501,
  );
});

export const logosRoutes = app;
