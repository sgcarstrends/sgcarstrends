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

    // Check if post already exists for this month
    const existingPost = await getExistingPostByMonth<"cars">(month, "cars");

    if (existingPost.length > 0) {
      return {
        message:
          "Post already exists for this month. Skipped generation and social media.",
      };
    }

    const post = await generateCarPost(context, month);

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

    return {
      message: "Car data processed and published successfully",
    };
  },
  { ...options },
);
