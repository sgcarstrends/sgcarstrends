import type { WorkflowContext } from "@upstash/workflow";
import { SITE_URL } from "@web/config";
import { socialMediaManager } from "@web/config/platforms";
import { realtime } from "@web/config/realtime";
import { generateCoePost } from "@web/lib/workflows/posts";
import {
  checkExistingPost,
  processTask,
  publishToAllPlatforms,
  revalidateCache,
  type WorkflowStep,
} from "@web/lib/workflows/steps";
import { updateCoe } from "@web/lib/workflows/update-coe";
import { getCOELatestRecord } from "@web/queries/coe/latest-month";

export async function coeWorkflow(context: WorkflowContext) {
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
      message: "No COE records processed. Skipped publishing to social media.",
    };
  }

  const record = await getCOELatestRecord();
  if (!record) {
    return { message: "[COE] No COE records found" };
  }
  const { month, biddingNo } = record;
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
  const link = `${SITE_URL}/blog/${post.slug}`;
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
}
