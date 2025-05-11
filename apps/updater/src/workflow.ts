import { postToDiscord } from "@updater/lib/discord/post-to-discord";
import { postToLinkedin } from "@updater/lib/linkedin/post-to-linkedin";
import { postToTelegram } from "@updater/lib/telegram/post-to-telegram";
import { postToTwitter } from "@updater/lib/twitter/post-to-twitter";
import { updateCOE } from "@updater/lib/updateCOE";
import { updateCOEPQP } from "@updater/lib/updateCOEPQP";
import { updateCars } from "@updater/lib/updateCars";
import {
  type IPlatform,
  type Task,
  processTask,
  publishToPlatform,
} from "@updater/lib/workflow";
import { Stage } from "@updater/types";
import { Platform } from "@updater/types/social-media";
import { Receiver } from "@upstash/qstash";
import { serve } from "@upstash/workflow/hono";
import { Hono } from "hono";
import { Resource } from "sst";

const app = new Hono();

const isProduction = Resource.App.stage === Stage.PRODUCTION;

app.post(
  "/",
  serve(
    async (context) => {
      const tasks: Task[] = [
        { name: "cars", handler: updateCars },
        { name: "coe", handler: updateCOE },
        { name: "coe-pqp", handler: updateCOEPQP },
      ];

      const platforms: IPlatform[] = [
        {
          platform: Platform.Discord,
          handler: postToDiscord,
          enabled: true,
        },
        {
          platform: Platform.LinkedIn,
          handler: postToLinkedin,
          enabled: isProduction,
        },
        {
          platform: Platform.Telegram,
          handler: postToTelegram,
          enabled: true,
        },
        {
          platform: Platform.Twitter,
          handler: postToTwitter,
          enabled: isProduction,
        },
      ];

      // Process all tasks in parallel and collect results
      const results = await Promise.all(
        tasks.map(({ name, handler }) => processTask(context, name, handler)),
      );

      for (const { table, updated } of results) {
        if (table === "cars" && updated) {
          await Promise.all(
            platforms.map((platform) =>
              publishToPlatform(context, platform, table),
            ),
          );
        }
      }
    },
    {
      receiver: new Receiver({
        currentSigningKey: Resource.QSTASH_CURRENT_SIGNING_KEY.value,
        nextSigningKey: Resource.QSTASH_NEXT_SIGNING_KEY.value,
      }),
      onError: async (error) => {
        const payload = {
          embeds: [
            {
              title: "❌ Upstash Workflow Failed",
              color: 0xff0000,
              fields: [
                {
                  name: "Error Type",
                  value: error.name ?? "Unknown",
                  inline: true,
                },
                {
                  name: "Status",
                  value: "Failed",
                  inline: true,
                },
                {
                  name: "Error Cause",
                  value: error.cause ?? "Unknown",
                  inline: true,
                },
                {
                  name: "Error Message",
                  value: error.message?.slice(0, 1000) ?? "Unknown",
                },

                {
                  name: "Stack Trace",
                  value: error.stack?.slice(0, 1000) ?? "Unknown",
                },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        };

        console.log(payload);

        try {
          await fetch(Resource.DISCORD_WORKFLOW_WEBHOOK_URL.value, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } catch (error) {
          console.error("Failed to send Discord log:", error);
        }
      },
      // TODO: There seems to be a bug with `failureFunction` for now
      // failureFunction: async ({
      //   context,
      //   failStatus,
      //   failResponse,
      //   failHeaders,
      // }) => {
      //   console.error("Update workflow failed:", failResponse);
      //
      //   const payload = {
      //     embeds: [
      //       {
      //         title: "❌ Upstash Workflow Failed",
      //         color: 0xff0000,
      //         fields: [
      //           {
      //             name: "Status",
      //             value: String(failStatus),
      //             inline: true,
      //           },
      //           {
      //             name: "Run ID",
      //             value: context?.workflowRunId || "N/A",
      //             inline: true,
      //           },
      //           {
      //             name: "Response",
      //             value: JSON.stringify(failResponse).slice(0, 1000) || "N/A",
      //           },
      //           {
      //             name: "Headers",
      //             value: JSON.stringify(failHeaders).slice(0, 1000) || "N/A",
      //           },
      //         ],
      //         timestamp: new Date().toISOString(),
      //       },
      //     ],
      //   };
      //
      //   console.log("failureFunction", payload);
      //
      //   try {
      //     await fetch(Resource.DISCORD_WORKFLOW_WEBHOOK_URL.value, {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify(payload),
      //     });
      //   } catch (error) {
      //     console.error("Failed to send Discord log:", error);
      //   }
      // },
    },
  ),
);

export default app;
