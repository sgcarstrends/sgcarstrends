import crypto from "node:crypto";
import { UPDATER_BASE_URL } from "@api/updater/config";
import { client } from "@api/updater/config/qstash";
import { discord } from "@api/updater/routes/discord";
import { linkedin } from "@api/updater/routes/linkedin";
import { telegram } from "@api/updater/routes/telegram";
import { twitter } from "@api/updater/routes/twitter";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { Resource } from "sst";

import workflow from "./workflow";

const app = new Hono();

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

export default app;
