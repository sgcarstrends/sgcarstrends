import {
  NewsletterBroadcastError,
  triggerNewsletterWorkflow,
} from "@api/features/newsletter";
import type { OpenAPIHono } from "@hono/zod-openapi";

export const registerNewsletterRoutes = (app: OpenAPIHono) => {
  app.post("/newsletter/trigger", async (c) => {
    try {
      const { workflowRunId } = await triggerNewsletterWorkflow();

      return c.json({
        success: true,
        message: "Newsletter workflow triggered successfully",
        workflowRunIds: [workflowRunId],
      });
    } catch (error) {
      const message =
        error instanceof NewsletterBroadcastError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unknown workflow error";

      return c.json(
        {
          success: false,
          message: "Failed to trigger newsletter workflow",
          error: message,
        },
        500,
      );
    }
  });
};
