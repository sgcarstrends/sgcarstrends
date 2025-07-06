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
import { Resource } from "sst";

const app = new OpenAPIHono();

const authMiddleware = bearerAuth({
  token: Resource.SG_CARS_TRENDS_API_TOKEN.value,
});

app.openapi(
  createRoute({
    method: "post",
    path: "/trigger",
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
  authMiddleware,
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

app.openapi(
  createRoute({
    method: "post",
    path: "/cars",
    summary: "Car data update workflow endpoint",
    description:
      "Execute the car registration data update workflow to fetch and process latest data from LTA DataMall",
    tags: ["Workflows"],
    responses: {
      200: {
        description: "Workflow executed successfully",
        content: {
          "application/json": {
            schema: WorkflowTriggerResponseSchema,
          },
        },
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
  serveMany({
    cars: carsWorkflow,
  }),
);

app.openapi(
  createRoute({
    method: "post",
    path: "/coe",
    summary: "COE data update workflow endpoint",
    description:
      "Execute the COE bidding data update workflow to fetch and process latest data from LTA DataMall",
    tags: ["Workflows"],
    responses: {
      200: {
        description: "Workflow executed successfully",
        content: {
          "application/json": {
            schema: WorkflowTriggerResponseSchema,
          },
        },
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
  serveMany({
    coe: coeWorkflow,
  }),
);

app.route("/linkedin", linkedin);
app.route("/twitter", twitter);
app.route("/discord", discord);
app.route("/telegram", telegram);

export default app;
