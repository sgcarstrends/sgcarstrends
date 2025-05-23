import { platforms } from "@updater/config/platforms";
import { updateCOE } from "@updater/lib/update-COE";
import {
  type Task,
  processTask,
  publishToPlatform,
} from "@updater/lib/workflow";
import { options } from "@updater/lib/workflows/options";
import { createWorkflow } from "@upstash/workflow/hono";

export const coeWorkflow = createWorkflow(
  async (context) => {
    const coeTasks: Task[] = [{ name: "coe", handler: updateCOE }];

    const coeTaskResults = await Promise.all(
      coeTasks.map(({ name, handler }) => processTask(context, name, handler)),
    );

    // Flatten the results since updateCOE returns an array of results
    const coeResults = coeTaskResults.flat();

    const processedCOEResults = coeResults.filter(
      ({ recordsProcessed }) => recordsProcessed > 0,
    );

    if (processedCOEResults.length === 0) {
      return {
        message:
          "No COE records processed. Skipped publishing to social media.",
      };
    }

    const message = [
      "💰 Latest COE bidding results are in!\n",
      "👇🏼 See the newest premium rates.\n\n",
    ].join("\n");

    const link = "https://sgcarstrends.com/coe";

    for (const _ of processedCOEResults) {
      await Promise.all(
        platforms.map((platform) =>
          publishToPlatform(context, platform, { message, link }),
        ),
      );
    }

    return {
      message: "COE data processed and published successfully",
    };
  },
  { ...options },
);
