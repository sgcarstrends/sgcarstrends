import { NEXT_PUBLIC_SITE_URL } from "@api/config";
import { socialMediaManager } from "@api/config/platforms";
import { getCarsLatestMonth } from "@api/features/cars/queries";
import { options } from "@api/lib/workflows/options";
import { generateCarPost } from "@api/lib/workflows/posts";
import {
  checkExistingPost,
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
    const year = month.split("-")[0];

    // Step: Revalidate data cache (always runs)
    await revalidateCache(context, [
      `cars:month:${month}`,
      `cars:year:${year}`,
      "cars:months",
    ]);

    // Step: Check if post already exists (always runs)
    const existingPost = await checkExistingPost(context, month, "cars");
    if (existingPost) {
      return {
        message:
          "[CARS] Data processed. Post already exists, skipping social media.",
      };
    }

    // Step: Generate new post (only runs if no existing post)
    const post = await generateCarPost(context, month);

    // Step: Publish to social media
    const link = `${NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`;
    await publishToAllPlatforms(context, socialMediaManager, {
      message: `📰 New Blog Post: ${post.title}`,
      link,
    });

    // Step: Revalidate posts cache
    await revalidateCache(context, ["posts:list"]);

    return {
      message: "[CARS] Data processed and published successfully",
    };
  },
  { ...options },
);
