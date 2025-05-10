import redis from "@updater/config/redis";
import { postToDiscord } from "@updater/lib/discord/post-to-discord";
import { postToLinkedin } from "@updater/lib/linkedin/post-to-linkedin";
import { postToTelegram } from "@updater/lib/telegram/post-to-telegram";
import { postToTwitter } from "@updater/lib/twitter/post-to-twitter";
import { updateCOE } from "@updater/lib/updateCOE";
import { updateCOEPQP } from "@updater/lib/updateCOEPQP";
import { updateCars } from "@updater/lib/updateCars";
import type { UpdaterResult } from "@updater/lib/updater";
import { Stage } from "@updater/types";
import {
  Platform,
  type PostToSocialMediaParam,
} from "@updater/types/social-media";
import { Receiver } from "@upstash/qstash";
import { serve } from "@upstash/workflow/hono";
import { Hono } from "hono";
import { Resource } from "sst";

interface Task {
  name: string;
  fn: () => Promise<UpdaterResult>;
}

interface IPlatform {
  platform: Platform;
  fn: ({ message, link }: PostToSocialMediaParam) => Promise<unknown>;
  enabled: boolean;
}

const app = new Hono();

const isProduction = Resource.App.stage === Stage.PRODUCTION;

app.post(
  "/",
  serve(
    async (context) => {
      const tasks: Task[] = [
        { name: "cars", fn: updateCars },
        { name: "coe", fn: updateCOE },
        { name: "coe-pqp", fn: updateCOEPQP },
      ];

      const platforms: IPlatform[] = [
        { platform: Platform.Discord, fn: postToDiscord, enabled: true },
        {
          platform: Platform.LinkedIn,
          fn: postToLinkedin,
          enabled: isProduction,
        },
        { platform: Platform.Telegram, fn: postToTelegram, enabled: true },
        {
          platform: Platform.Twitter,
          fn: postToTwitter,
          enabled: isProduction,
        },
      ];

      const results = await Promise.all(
        tasks.map(({ name, fn }) =>
          context.run(`Processing "${name}" data`, async () => {
            console.log(`Processing "${name}" data`);

            try {
              const result = await fn();
              const { updated } = result;

              if (updated) {
                const now = Date.now();
                await redis.set(`lastUpdated:${name}`, now);
                console.log(`Last updated "${name}":`, now);
              } else {
                console.log(`No changes for "${name}"`);
              }

              return result;
            } catch (error) {
              console.error(`Task "${name}" failed`, error);
              throw error;
            }
          }),
        ),
      );

      for (const { table, updated } of results) {
        if (updated) {
          await Promise.all(
            platforms.map(
              ({ platform, fn, enabled }) =>
                enabled &&
                context.run(
                  `Publish to ${platform} for ${table} updates`,
                  async () => {
                    console.log(`Publishing to ${platform} for ${table}`);
                    const result = await fn({
                      message: `Updates for ${table}`,
                      link: "https://sgcarstrends.com",
                    });
                    console.log(`[${platform}]`, result);
                    return result;
                  },
                ),
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
