import { updateCOE } from "@updater/lib/updateCOE";
import { updateCOEPQP } from "@updater/lib/updateCOEPQP";
import { updateCars } from "@updater/lib/updateCars";
import { Receiver } from "@upstash/qstash";
import { serve } from "@upstash/workflow/hono";
import { Hono } from "hono";
import { Resource } from "sst";

const app = new Hono();

app.post(
  "/",
  serve(
    async (context) => {
      await context.run("updater", async () => {
        console.log("Running updater");

        await updateCars();
        await updateCOE();
        await updateCOEPQP();
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
