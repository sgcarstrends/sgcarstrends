import crypto from "node:crypto";
import { WORKFLOWS_BASE_URL } from "@api/config";
import { client, receiver } from "@api/config/qstash";
import {
  NewsletterBroadcastError,
  newsletterWorkflow,
  triggerNewsletterWorkflow,
} from "@api/features/newsletter";
import { WorkflowTriggerResponseSchema } from "@api/features/workflows/schemas";
import { carsWorkflow } from "@api/lib/workflows/cars";
import { coeWorkflow } from "@api/lib/workflows/coe";
import { deregistrationWorkflow } from "@api/lib/workflows/deregistration";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { serveMany } from "@upstash/workflow/hono";
import { createMiddleware } from "hono/factory";

const app = new OpenAPIHono();

const verifyQStash = createMiddleware(async (c, next) => {
  const signature = c.req.header("Upstash-Signature");

  if (!signature) {
    return c.json({ error: "Missing QStash signature" }, 401);
  }

  const body = await c.req.text();

  const isValid = await receiver.verify({ signature, body }).catch((err) => {
    console.error("[verifyQStash] Verify error:", err.message);
    return false;
  });

  if (!isValid) {
    return c.json({ error: "Invalid QStash signature" }, 401);
  }

  return next();
});

app.openapi(
  createRoute({
    method: "post",
    path: "/trigger",
    middleware: [verifyQStash],
    summary: "Trigger data update workflows",
    description:
      "Trigger both cars and COE data update workflows for fetching latest data from LTA DataMall. Requires QStash signature verification.",
    tags: ["Workflows"],
    responses: {
      200: {
        description: "Workflows triggered successfully",
        content: {
          "application/json": {
            schema: WorkflowTriggerResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized - Invalid QStash signature",
      },
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: WorkflowTriggerResponseSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    try {
      const endpoints = ["cars", "coe", "deregistrations"];
      const workflows = endpoints.map((endpoint) => {
        const workflowRunId: string = crypto.randomUUID();

        return client.trigger({
          url: `${WORKFLOWS_BASE_URL}/${endpoint}`,
          headers: {
            "Upstash-Workflow-RunId": workflowRunId,
          },
          workflowRunId,
        });
      });

      const workflowRunIds = await Promise.all(workflows);

      return c.json({
        success: true,
        message: "Workflows triggered successfully",
        workflowRunIds: workflowRunIds.map(
          ({ workflowRunId }) => workflowRunId,
        ),
      });
    } catch (error) {
      console.error("[trigger] Error:", error);
      return c.json(
        {
          success: false,
          message: "Failed to trigger workflows",
          error: error.message,
        },
        500,
      );
    }
  },
);

app.openapi(
  createRoute({
    method: "post",
    path: "/newsletter/trigger",
    middleware: [verifyQStash],
    summary: "Trigger newsletter workflow",
    description:
      "Trigger the monthly newsletter broadcast workflow. Requires QStash signature verification.",
    tags: ["Workflows"],
    responses: {
      200: {
        description: "Newsletter workflow triggered successfully",
        content: {
          "application/json": {
            schema: WorkflowTriggerResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized - Invalid QStash signature",
      },
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: WorkflowTriggerResponseSchema,
          },
        },
      },
    },
  }),
  async (c) => {
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
  },
);

app.post(
  "/*",
  serveMany({
    cars: carsWorkflow,
    coe: coeWorkflow,
    deregistrations: deregistrationWorkflow,
    newsletter: newsletterWorkflow,
  }),
);

export const workflowRoutes = app;
