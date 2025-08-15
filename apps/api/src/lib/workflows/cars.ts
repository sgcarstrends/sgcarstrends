import { SITE_URL } from "@api/config";
import { platforms } from "@api/config/platforms";
import { options } from "@api/lib/workflows/options";
import { generateCarPost } from "@api/lib/workflows/posts";
import {
  getCarRegistrationsByMonth,
  getCarsLatestMonth,
} from "@api/lib/workflows/queries/cars";
import { updateCars } from "@api/lib/workflows/updateCars";
import {
  processTask,
  publishToPlatform,
  type Task,
} from "@api/lib/workflows/workflow";
import slugify from "@sindresorhus/slugify";
import { createWorkflow } from "@upstash/workflow/hono";

export const carsWorkflow = createWorkflow(
  async (context) => {
    const carTasks: Task[] = [{ name: "cars", handler: updateCars }];

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

    const result = await getCarRegistrationsByMonth(month);

    const message = [
      `🚗 Updated car registration data for ${result.month}!`,
      `\n📊 Total registrations: ${result.total.toLocaleString()}`,
      "\n⚡ By Fuel Type:",
      ...Object.entries(result.fuelType).map(
        ([type, count]) => `${type}: ${count.toLocaleString()}`,
      ),
      "\n🚙 By Vehicle Type:",
      ...Object.entries(result.vehicleType).map(
        ([type, count]) => `${type}: ${count.toLocaleString()}`,
      ),
    ].join("\n");

    const link = `${SITE_URL}/cars?month=${month}`;

    // for (const _ of processedCarResults) {
    //   await Promise.all(
    //     platforms.map((platform) =>
    //       publishToPlatform(context, platform, { message, link }),
    //     ),
    //   );
    // }

    const post = await generateCarPost(context, month);

    // Announce new blog post on social media
    if (post?.success && post?.title) {
      const link = `${SITE_URL}/blog/${post.slug}`;
      const message = `📰 New Blog Post: ${post.title}`;

      await Promise.all(
        platforms.map((platform) =>
          publishToPlatform(context, platform, { message, link }),
        ),
      );
    }

    return {
      message: "Car data processed and published successfully",
    };
  },
  { ...options },
);
