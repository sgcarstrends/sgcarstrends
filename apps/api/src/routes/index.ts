import crypto from "node:crypto";
import { client } from "@api/config/qstash";
import { WORKFLOWS_BASE_URL } from "@api/config/workflow";
import { carsWorkflow } from "@api/lib/workflows/cars";
import { coeWorkflow } from "@api/lib/workflows/coe";
import { discord } from "@api/routes/workflows/discord";
import { linkedin } from "@api/routes/workflows/linkedin";
import { telegram } from "@api/routes/workflows/telegram";
import { twitter } from "@api/routes/workflows/twitter";
import { serveMany } from "@upstash/workflow/hono";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { Resource } from "sst";

const app = new Hono();

const authMiddleware = bearerAuth({
  token: Resource.SG_CARS_TRENDS_API_TOKEN.value,
});

app.post("/trigger", authMiddleware, async (c) => {
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
      workflowRunIds: workflowRunIds.map(({ workflowRunId }) => workflowRunId),
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
});

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
