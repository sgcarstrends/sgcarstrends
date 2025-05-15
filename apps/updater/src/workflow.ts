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
import { createWorkflow, serveMany } from "@upstash/workflow/hono";
import { Hono } from "hono";
import { Resource } from "sst";

const app = new Hono();

const isProduction = Resource.App.stage === Stage.PRODUCTION;

const workflowOptions = {
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
};

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

const carsWorkflow = createWorkflow(
  async (context) => {
    const carTasks: Task[] = [{ name: "cars", handler: updateCars }];

    const carResults = await Promise.all(
      carTasks.map(({ name, handler }) => processTask(context, name, handler)),
    );

    const processedCarResults = carResults.filter(
      ({ recordsProcessed }) => recordsProcessed > 0,
    );

    if (processedCarResults.length === 0) {
      return {
        message:
          "No car records processed. Skipped publishing to social media.",
      };
    }

    for (const { table } of processedCarResults) {
      await Promise.all(
        platforms.map((platform) =>
          publishToPlatform(context, platform, table),
        ),
      );
    }

    return {
      message: "Car data processed and published successfully",
    };
  },
  { ...workflowOptions },
);

const coeWorkflow = createWorkflow(
  async (context) => {
    const coeTasks: Task[] = [
      { name: "coe", handler: updateCOE },
      { name: "coe-pqp", handler: updateCOEPQP },
    ];

    const coeResults = await Promise.all(
      coeTasks.map(({ name, handler }) => processTask(context, name, handler)),
    );

    const processedCOEResults = coeResults.filter(
      ({ recordsProcessed }) => recordsProcessed > 0,
    );

    if (processedCOEResults.length === 0) {
      return {
        message:
          "No COE records processed. Skipped publishing to social media.",
      };
    }

    for (const { table } of processedCOEResults) {
      await Promise.all(
        platforms.map((platform) =>
          publishToPlatform(context, platform, table),
        ),
      );
    }

    return {
      message: "COE data processed and published successfully",
    };
  },
  { ...workflowOptions },
);

app.post(
  "/*",
  serveMany({
    cars: carsWorkflow,
    coe: coeWorkflow,
  }),
);

export default app;
