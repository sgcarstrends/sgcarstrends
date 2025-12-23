import { NEXT_PUBLIC_SITE_URL } from "@api/config";
import { socialMediaManager } from "@api/config/platforms";
import { realtime } from "@api/config/realtime";
import { getCoeLatestMonth } from "@api/features/coe/queries";
import { options } from "@api/lib/workflows/options";
import { generateCoePost } from "@api/lib/workflows/posts";
import {
  checkExistingPost,
  processTask,
  publishToAllPlatforms,
  revalidateCache,
  type WorkflowStep,
} from "@api/lib/workflows/steps";
import { updateCoe } from "@api/lib/workflows/update-coe";
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

    const { month, biddingNo } = await getCoeLatestMonth();
    const year = month.split("-")[0];

    // Step: Revalidate data cache (always runs)
    await revalidateCache(context, [
      "coe:latest",
      "coe:months",
      `coe:year:${year}`,
    ]);

    // Only generate blog post when both bidding exercises are complete
    if (biddingNo !== 2) {
      return {
        message:
          "[COE] Data processed. Waiting for second bidding exercise to generate post.",
      };
    }

    // Step: Check if post already exists (always runs when biddingNo === 2)
    const existingPost = await checkExistingPost(context, month, "coe");
    if (existingPost) {
      return {
        message:
          "[COE] Data processed. Post already exists, skipping social media.",
      };
    }

    // Step: Generate new post (only runs if no existing post)
    const post = await generateCoePost(context, month);

    // Step: Publish to social media
    const link = `${NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`;
    await publishToAllPlatforms(context, socialMediaManager, {
      message: `📰 New Blog Post: ${post.title}`,
      link,
    });

    // Step: Revalidate posts cache
    await revalidateCache(context, ["posts:list"]);

    await context.run("send-notification", async () => {
      await realtime.emit("workflow.completed", {
        workflow: "coe",
        message: `COE results updated for ${month}`,
        month,
      });
    });

    return {
      message: "[COE] Data processed and published successfully",
    };
  },
  { ...options },
);
