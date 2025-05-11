import crypto from "node:crypto";
import { UPDATER_BASE_URL } from "@updater/config";
import { client } from "@updater/config/qstash";
import { discord } from "@updater/routes/discord";
import { linkedin } from "@updater/routes/linkedin";
import { telegram } from "@updater/routes/telegram";
import { twitter } from "@updater/routes/twitter";
// import { publishToSocialMedia } from "@updater/utils/social-media-publisher";
// import { updateCOEPQP } from "@updater/lib/updateCOEPQP";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { bearerAuth } from "hono/bearer-auth";
import { showRoutes } from "hono/dev";
import { Resource } from "sst";
import packageJson from "../package.json" assert { type: "json" };
// import { updateCOE } from "./lib/updateCOE";
// import { updateCars } from "./lib/updateCars";
import workflow from "./workflow";

const app = new Hono();

app.get("/", async (c) => {
  return c.json({
    status: "ok",
    version: packageJson.version,
  });
});

const authMiddleware = bearerAuth({ token: Resource.UPDATER_API_TOKEN.value });

app.post("/qstash", authMiddleware, async (c) => {
  const workflowRunId: string = crypto.randomUUID();

  const response = await client.trigger({
    url: `${UPDATER_BASE_URL}/workflow`,
    headers: {
      "Upstash-Workflow-RunId": workflowRunId,
    },
    workflowRunId,
  });

  console.log(response);

  return c.json(response);
});

app.route("/workflow", workflow);

app.route("/linkedin", linkedin);
app.route("/twitter", twitter);
app.route("/discord", discord);
app.route("/telegram", telegram);

// app.use("/process/*", bearerAuth({ token: Resource.UPDATER_API_TOKEN.value }));

// app.post("/process/cars", async (c) => {
//   const response = await updateCars();
//   return c.json(response);
// });
//
// app.post("/process/coe-result", async (c) => {
//   const response = await updateCOE();
//   return c.json(response);
// });
//
// app.post("/process/coe-pqp", async (c) => {
//   const response = await updateCOEPQP();
//   return c.json(response);
// });

// app.post("/social/publish", async (c) => {
//   try {
//     const body = await c.req.json();
//     const { result, platforms = ["linkedin"] } = body;
//
//     if (!result || !result.table) {
//       return c.json({ error: "Missing required updater result" }, 400);
//     }
//
//     const publishResults = await publishToSocialMedia(result, {
//       platforms,
//     });
//     console.log(publishResults);
//
//     return c.json({
//       success: true,
//       publishResults,
//     });
//   } catch (error) {
//     console.error("Error in social media publish:", error);
//     return c.json({ error: error.message }, 500);
//   }
// });

showRoutes(app);

export const handler = handle(app);
