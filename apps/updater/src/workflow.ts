import redis from "@updater/config/redis";
import { updateCOE } from "@updater/lib/updateCOE";
import { updateCOEPQP } from "@updater/lib/updateCOEPQP";
import { updateCars } from "@updater/lib/updateCars";
import type { UpdaterResult } from "@updater/lib/updater";
import { Receiver } from "@upstash/qstash";
import { serve } from "@upstash/workflow/hono";
import { Hono } from "hono";
import { Resource } from "sst";

interface Task {
  name: string;
  fn: () => Promise<UpdaterResult>;
}

const app = new Hono();

app.post(
  "/",
  serve(
    async (context) => {
      await context.run("updater", async () => {
        console.log("Running updater");

        const tasks: Task[] = [
          { name: "cars", fn: updateCars },
          { name: "coe", fn: updateCOE },
          { name: "coe-pqp", fn: updateCOEPQP },
        ];

        for (const { name, fn } of tasks) {
          try {
            const now = Date.now();
            await fn();
            console.log(`Last updated "${name}"`, { timestamp: now });
            await redis.set(`lastUpdated:${name}`, now);
          } catch (error) {
            console.error(error);
          }
        }

        return;
      });
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
