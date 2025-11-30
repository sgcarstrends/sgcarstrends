import { SITE_URL } from "@api/config";
import { socialMediaManager } from "@api/config/platforms";
import { getCarsLatestMonth } from "@api/features/cars/queries";
import { getExistingPostByMonth } from "@api/features/posts/queries";
import { options } from "@api/lib/workflows/options";
import { generateCarPost } from "@api/lib/workflows/posts";
import { updateCars } from "@api/lib/workflows/update-cars";
import {
  processTask,
  publishToAllPlatforms,
  revalidateWebCache,
  type WorkflowStep,
} from "@api/lib/workflows/workflow";
import { createWorkflow } from "@upstash/workflow/hono";

export const carsWorkflow = createWorkflow(
  async (context) => {
    const carTasks: WorkflowStep[] = [{ name: "cars", handler: updateCars }];

    const carResults = await Promise.all(
      carTasks.map(({ name, handler }) => processTask(context, name, handler)),
    );

    const processedCarResults = carResults.filter(
      ({ recordsProcessed }) => recordsProcessed > 0,
    );

    if (processedCarResults.length === 0) {
      return {
        message:
          "No car records processed. Skipped publishing to social media.",
      };
    }

    // Get latest updated month for cars from the database
    const { month } = await getCarsLatestMonth();

    // Invalidate cache for updated car data
    const year = month.split("-")[0];
    await revalidateWebCache(context, [
      `cars:month:${month}`,
      `cars:year:${year}`,
      "cars:months",
      "cars:makes",
      "cars:annual",
    ]);

    // Step: Check if post exists and determine if social should publish
    const { post: cachedPost, shouldPublishSocial } = await context.run(
      "Check existing post",
      async () => {
        const posts = await getExistingPostByMonth<"cars">(month, "cars");
        const [existingPost] = posts;

        if (existingPost) {
          // Post exists - skip social (already published in previous workflow)
          return {
            post: {
              postId: existingPost.id,
              title: existingPost.title,
              slug: existingPost.slug,
            },
            shouldPublishSocial: false,
          };
        }

        // No post - will generate and publish social
        return { post: null, shouldPublishSocial: true };
      },
    );

    // Step: Generate post only if none exists
    const post = cachedPost ?? (await generateCarPost(context, month));

    // Step: Publish to social media only if shouldPublishSocial is true
    if (post?.title && shouldPublishSocial) {
      // Invalidate cache for new blog post
      await revalidateWebCache(context, ["posts:list"]);

      const link = `${SITE_URL}/blog/${post.slug}`;
      const message = `📰 New Blog Post: ${post.title}`;

      await publishToAllPlatforms(context, socialMediaManager, {
        message,
        link,
      });
    }

    return {
      message: "[CARS] Data processed and published successfully",
    };
  },
  { ...options },
);
