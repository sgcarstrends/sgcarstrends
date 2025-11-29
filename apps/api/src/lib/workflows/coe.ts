import { SITE_URL } from "@api/config";
import { socialMediaManager } from "@api/config/platforms";
import { getCoeLatestMonth } from "@api/features/coe/queries";
import { getExistingPostByMonth } from "@api/features/posts/queries";
import { options } from "@api/lib/workflows/options";
import { generateCoePost } from "@api/lib/workflows/posts";
import { updateCoe } from "@api/lib/workflows/update-coe";
import {
  processTask,
  publishToAllPlatforms,
  revalidateWebCache,
  type WorkflowStep,
} from "@api/lib/workflows/workflow";
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

    // Invalidate cache for updated COE data
    const year = month.split("-")[0];
    await revalidateWebCache(context, [
      "coe:results",
      "coe:latest",
      "coe:months",
      `coe:year:${year}`,
    ]);

    // Check if post already exists for this month
    const existingPost = await getExistingPostByMonth<"coe">(month, "coe");

    if (existingPost.length > 0) {
      return {
        message:
          "Post already exists for this month. Skipped generation and social media.",
      };
    }

    // Generate blog post only when both bidding exercises are complete (biddingNo = 2)
    if (biddingNo === 2) {
      const post = await generateCoePost(context, month);

      // Announce new blog post on social media
      if (post?.success && post?.title) {
        // Invalidate cache for new blog post
        await revalidateWebCache(context, ["posts:list"]);

        const link = `${SITE_URL}/blog/${post.slug}`;
        const message = `📰 New Blog Post: ${post.title}`;

        await publishToAllPlatforms(context, socialMediaManager, {
          message,
          link,
        });
      }
    }

    return {
      message: "COE data processed and published successfully",
    };
  },
  { ...options },
);
