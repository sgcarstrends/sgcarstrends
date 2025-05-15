import { platforms } from "@updater/config/platforms";
import { updateCOE } from "@updater/lib/updateCOE";
import { updateCOEPQP } from "@updater/lib/updateCOEPQP";
import {
  type Task,
  processTask,
  publishToPlatform,
} from "@updater/lib/workflow";
import { options } from "@updater/lib/workflows/options";
import { createWorkflow } from "@upstash/workflow/hono";

export const coeWorkflow = createWorkflow(
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
  { ...options },
);
