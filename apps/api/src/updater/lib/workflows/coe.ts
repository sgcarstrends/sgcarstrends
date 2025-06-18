import { SITE_URL } from "@api/updater/config";
import { platforms } from "@api/updater/config/platforms";
import {
  getCoeLatestMonth,
  getLatestCoeResult,
} from "@api/updater/db/queries/coe";
import { updateCOE } from "@api/updater/lib/update-COE";
import {
  processTask,
  publishToPlatform,
  type Task,
} from "@api/updater/lib/workflow";
import { options } from "@api/updater/lib/workflows/options";
import { formatOrdinal } from "@sgcarstrends/utils";
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

    const { month, bidding_no: biddingNo } = await getCoeLatestMonth();
    const result = await getLatestCoeResult({ month, biddingNo });

    const message = [
      `💰 Latest COE results for ${result[0]?.month} (${formatOrdinal(result[0]?.bidding_no)} Bidding)!`,
      "\n💸 Premium rates by category:",
      ...result.map(
        (coe) => `${coe.vehicle_class}: $${coe.premium.toLocaleString()}`,
      ),
    ].join("\n");

    const link = `${SITE_URL}/coe`;

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
