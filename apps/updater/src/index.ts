import crypto from "node:crypto";
import { UPDATER_BASE_URL } from "@updater/config";
import { client } from "@updater/config/qstash";
import { discord } from "@updater/routes/discord";
import { linkedin } from "@updater/routes/linkedin";
import { telegram } from "@updater/routes/telegram";
import { twitter } from "@updater/routes/twitter";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { bearerAuth } from "hono/bearer-auth";
import { showRoutes } from "hono/dev";
import { Resource } from "sst";
import packageJson from "../package.json" assert { type: "json" };
import workflow from "./workflow";

const app = new Hono();

app.get("/", async (c) => {
  return c.json({
    status: "ok",
    version: packageJson.version,
  });
});

const authMiddleware = bearerAuth({ token: Resource.UPDATER_API_TOKEN.value });

app.post("/workflows/trigger", authMiddleware, async (c) => {
  try {
    const endpoints = ["cars", "coe"];
    const workflows = endpoints.map((endpoint) => {
      const workflowRunId: string = crypto.randomUUID();

      return client.trigger({
        url: `${UPDATER_BASE_URL}/workflow/${endpoint}`,
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

app.route("/workflow", workflow);

app.route("/linkedin", linkedin);
app.route("/twitter", twitter);
app.route("/discord", discord);
app.route("/telegram", telegram);

showRoutes(app);

export const handler = handle(app);
