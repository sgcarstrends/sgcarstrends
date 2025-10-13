import crypto from "node:crypto";
import { client } from "@api/config/qstash";
import { WORKFLOWS_BASE_URL } from "@api/config/workflow";
import { newsletterWorkflow } from "@api/features/newsletter";
import { carsWorkflow } from "@api/lib/workflows/cars";
import { coeWorkflow } from "@api/lib/workflows/coe";
import { registerNewsletterRoutes } from "@api/rest/newsletter/routes";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { serveMany } from "@upstash/workflow/hono";
import { bearerAuth } from "hono/bearer-auth";
import { WorkflowTriggerResponseSchema } from "./schemas";

const app = new OpenAPIHono();

const authMiddleware = bearerAuth({
  token: process.env.SG_CARS_TRENDS_API_TOKEN as string,
});

app.openapi(
  createRoute({
    method: "post",
    path: "/trigger",
    middleware: [authMiddleware],
    summary: "Trigger data update workflows",
    description:
      "Trigger both cars and COE data update workflows for fetching latest data from LTA DataMall",
    tags: ["Workflows"],
    security: [{ bearerAuth: [] }],
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
        description: "Unauthorized - Invalid bearer token",
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
      const endpoints = ["cars", "coe"];
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

registerNewsletterRoutes(app);

app.post(
  "/*",
  serveMany({
    cars: carsWorkflow,
    coe: coeWorkflow,
    newsletter: newsletterWorkflow,
  }),
);

export const workflowRoutes = app;
