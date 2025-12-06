import { SITE_URL } from "@api/config";
import { socialMediaManager } from "@api/config/platforms";
import { getCoeLatestMonth } from "@api/features/coe/queries";
import { getExistingPostByMonth } from "@api/features/posts/queries";
import { options } from "@api/lib/workflows/options";
import { generateCoePost } from "@api/lib/workflows/posts";
import {
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

    // Collect cache tags to invalidate
    const year = month.split("-")[0];
    const cacheTags = [
      "coe:results",
      "coe:latest",
      "coe:months",
      `coe:year:${year}`,
    ];

    // Generate blog post only when both bidding exercises are complete (biddingNo = 2)
    if (biddingNo === 2) {
      // Check if post exists
      const posts = await getExistingPostByMonth<"coe">(month, "coe");
      const [existingPost] = posts;

      const cachedPost = existingPost
        ? {
            postId: existingPost.id,
            title: existingPost.title,
            slug: existingPost.slug,
          }
        : null;
      const shouldPublishSocial = !existingPost;

      // Generate post only if none exists
      const post = cachedPost ?? (await generateCoePost(context, month));

      // Publish to social media only if shouldPublishSocial is true
      if (post?.title && shouldPublishSocial) {
        cacheTags.push("posts:list");

        const link = `${SITE_URL}/blog/${post.slug}`;
        const message = `📰 New Blog Post: ${post.title}`;

        await publishToAllPlatforms(context, socialMediaManager, {
          message,
          link,
        });
      }
    }

    // Revalidate all cache tags once at the end
    await revalidateCache(context, cacheTags);

    return {
      message: "[COE] Data processed and published successfully",
    };
  },
  { ...options },
);
