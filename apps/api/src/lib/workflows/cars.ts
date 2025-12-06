import { SITE_URL } from "@api/config";
import { socialMediaManager } from "@api/config/platforms";
import { getCarsLatestMonth } from "@api/features/cars/queries";
import { getExistingPostByMonth } from "@api/features/posts/queries";
import { options } from "@api/lib/workflows/options";
import { generateCarPost } from "@api/lib/workflows/posts";
import {
  processTask,
  publishToAllPlatforms,
  revalidateCache,
  type WorkflowStep,
} from "@api/lib/workflows/steps";
import { updateCars } from "@api/lib/workflows/update-cars";
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

    // Collect cache tags to invalidate
    const year = month.split("-")[0];
    const cacheTags = [
      `cars:month:${month}`,
      `cars:year:${year}`,
      "cars:months",
    ];

    // Check if post exists
    const posts = await getExistingPostByMonth<"cars">(month, "cars");
    const [existingPost] = posts;

    const cachedPost = existingPost
      ? {
          postId: existingPost.id,
          title: existingPost.title,
          slug: existingPost.slug,
        }
      : null;
    const shouldPublishSocial = !existingPost;

    // Step: Generate post only if none exists
    const post = cachedPost ?? (await generateCarPost(context, month));

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

    // Revalidate all cache tags once at the end
    await revalidateCache(context, cacheTags);

    return {
      message: "[CARS] Data processed and published successfully",
    };
  },
  { ...options },
);
