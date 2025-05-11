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
        if (updated) {
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
      failureFunction: async ({
        context,
        failStatus,
        failResponse,
        failHeaders,
      }) => {
        console.error("Update workflow failed:", failResponse);
      },
    },
  ),
);

export default app;
