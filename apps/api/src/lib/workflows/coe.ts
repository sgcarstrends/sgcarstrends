import { SITE_URL } from "@api/config";
import { socialMediaManager } from "@api/config/platforms";
import { options } from "@api/lib/workflows/options";
import { generateCoePost } from "@api/lib/workflows/posts";
import { updateCoe } from "@api/lib/workflows/update-coe";
import {
  processTask,
  publishToAllPlatforms,
  type WorkflowStep,
} from "@api/lib/workflows/workflow";
import { getCoeLatestMonth, getLatestCoeResult } from "@api/queries/coe";
import { formatOrdinal } from "@sgcarstrends/utils";
import { createWorkflow } from "@upstash/workflow/hono";

export const coeWorkflow = createWorkflow(
  async (context) => {
    const coeTasks: WorkflowStep[] = [{ name: "coe", handler: updateCoe }];

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

    // for (const _ of processedCOEResults) {
    //   await Promise.all(
    //     platforms.map((platform) =>
    //       publishToPlatform(context, platform, { message, link }),
    //     ),
    //   );
    // }

    // Generate blog post only when both bidding exercises are complete (bidding_no = 2)
    // if (biddingNo === 2) {
    //   const post = await generateCoePost(context, month);
    //
    //   // Announce new blog post on social media
    //   if (post?.success && post?.title) {
    //     const blogLink = `${SITE_URL}/blog/${post.slug}`;
    //     const blogMessage = `📰 New Blog Post: ${post.title}`;
    //
    //     await Promise.all(
    //       platforms.map((platform) =>
    //         publishToPlatform(context, platform, {
    //           message: blogMessage,
    //           link: blogLink,
    //         }),
    //       ),
    //     );
    //   }
    // }

    return {
      message: "COE data processed and published successfully",
    };
  },
  { ...options },
);
