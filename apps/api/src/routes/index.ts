import crypto from "node:crypto";
import { client } from "@api/config/qstash";
import { WORKFLOWS_BASE_URL } from "@api/config/workflow";
import { carsWorkflow } from "@api/lib/workflows/cars";
import { coeWorkflow } from "@api/lib/workflows/coe";
import { discord } from "@api/routes/workflows/discord";
import { linkedin } from "@api/routes/workflows/linkedin";
import { telegram } from "@api/routes/workflows/telegram";
import { twitter } from "@api/routes/workflows/twitter";
import { WorkflowTriggerResponseSchema } from "@api/schemas";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { serveMany } from "@upstash/workflow/hono";
import { bearerAuth } from "hono/bearer-auth";

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

app.post(
  "/*",
  serveMany({
    cars: carsWorkflow,
    coe: coeWorkflow,
  }),
);

app.route("/linkedin", linkedin);
app.route("/twitter", twitter);
app.route("/discord", discord);
app.route("/telegram", telegram);

export default app;
