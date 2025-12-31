import type { WorkflowContext } from "@upstash/workflow";
import { SITE_URL } from "@web/config";
import { socialMediaManager } from "@web/config/platforms";
import { realtime } from "@web/config/realtime";
import { generateCarPost } from "@web/lib/workflows/posts";
import {
  checkExistingPost,
  processTask,
  publishToAllPlatforms,
  revalidateCache,
} from "@web/lib/workflows/steps";
import { updateCars } from "@web/lib/workflows/update-cars";
import { getCarsLatestMonth } from "@web/queries/cars/latest-month";

export async function carsWorkflow(context: WorkflowContext) {
  const result = await processTask(context, "cars", updateCars);

  if (result.recordsProcessed === 0) {
    return {
      message: "No car records processed. Skipped publishing to social media.",
    };
  }

  // Get latest updated month for cars from the database
  const month = await getCarsLatestMonth();
  if (!month) {
    return { message: "[CARS] No car records found" };
  }
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

  await context.run("send-notification", async () => {
    await realtime.emit("workflow.completed", {
      workflow: "cars",
      message: `Car registrations updated for ${month}`,
      month,
    });
  });

  // Step: Generate new post (only runs if no existing post)
  const post = await generateCarPost(context, month);

  // Step: Publish to social media
  const link = `${SITE_URL}/blog/${post.slug}`;
  await publishToAllPlatforms(context, socialMediaManager, {
    message: `📰 New Blog Post: ${post.title}`,
    link,
  });

  // Step: Revalidate posts cache
  await revalidateCache(context, ["posts:list"]);

  return {
    message: "[CARS] Data processed and published successfully",
  };
}
