import {
  generateBlogContent,
  getCarsAggregatedByMonth,
} from "@sgcarstrends/ai";
import { redis, tokeniser } from "@sgcarstrends/utils";
import { SITE_URL } from "@web/config";
import type { UpdaterResult } from "@web/lib/updater";
import { updateCars } from "@web/lib/workflows/update-cars";
import { getCarsLatestMonth } from "@web/queries/cars/latest-month";
import { getExistingPostByMonth } from "@web/queries/posts";
import { revalidateTag } from "next/cache";
import { fetch } from "workflow";
import { publishToSocialMedia, revalidatePostsCache } from "./shared";

interface CarsWorkflowPayload {
  month?: string;
}

interface CarsWorkflowResult {
  message: string;
  postId?: string;
}

/**
 * Cars data workflow using Vercel WDK.
 * Processes car registration data, generates blog posts, and publishes to social media.
 */
export async function carsWorkflow(
  _payload: CarsWorkflowPayload,
): Promise<CarsWorkflowResult> {
  "use workflow";

  // Enable WDK's durable fetch for AI SDK
  globalThis.fetch = fetch;

  // Step 1: Process cars data
  const result = await processCarsData();

  if (result.recordsProcessed === 0) {
    return {
      message: "No car records processed. Skipped publishing to social media.",
    };
  }

  // Step 2: Get latest month from database
  const month = await getLatestMonth();
  if (!month) {
    return { message: "[CARS] No car records found" };
  }

  const year = month.split("-")[0];

  // Step 3: Revalidate data cache
  await revalidateCarsCache(month, year);

  // Step 4: Check if post already exists
  const existingPost = await checkExistingCarsPost(month);
  if (existingPost) {
    return {
      message:
        "[CARS] Data processed. Post already exists, skipping social media.",
    };
  }

  // Step 5: Fetch aggregated data for blog generation
  const carsData = await fetchCarsData(month);

  // Step 6: Generate blog post
  const post = await generateCarsPost(carsData, month);

  // Step 7: Publish to social media
  const link = `${SITE_URL}/blog/${post.slug}`;
  await publishToSocialMedia(post.title, link);

  // Step 8: Revalidate posts cache
  await revalidatePostsCache();

  return {
    message: "[CARS] Data processed and cache revalidated successfully",
    postId: post.postId,
  };
}

/**
 * Process cars data from LTA DataMall and update database.
 */
async function processCarsData(): Promise<UpdaterResult> {
  "use step";

  console.log("Processing cars data");

  const result = await updateCars();

  if (result.recordsProcessed > 0) {
    const now = Date.now();
    await redis.set("last_updated:cars", now);
    console.log("Last updated cars:", now);
  } else {
    console.log("No changes for cars");
  }

  return result;
}

/**
 * Get the latest month from the cars database.
 */
async function getLatestMonth(): Promise<string | null> {
  "use step";

  return getCarsLatestMonth();
}

/**
 * Revalidate Next.js cache tags for cars data.
 */
async function revalidateCarsCache(month: string, year: string): Promise<void> {
  "use step";

  const tags = [`cars:month:${month}`, `cars:year:${year}`, "cars:months"];

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  console.log(`[WORKFLOW] Cache invalidated for tags: ${tags.join(", ")}`);
}

/**
 * Check if a blog post already exists for the given month.
 */
async function checkExistingCarsPost(
  month: string,
): Promise<{ id: string } | null> {
  "use step";

  const [existingPost] = await getExistingPostByMonth(month, "cars");
  return existingPost ?? null;
}

/**
 * Fetch aggregated cars data for blog generation.
 */
async function fetchCarsData(month: string) {
  "use step";

  return getCarsAggregatedByMonth(month);
}

/**
 * Generate a blog post from cars data.
 */
async function generateCarsPost(
  carsData: Awaited<ReturnType<typeof getCarsAggregatedByMonth>>,
  month: string,
) {
  "use step";

  const data = tokeniser(carsData);

  return generateBlogContent({
    data,
    month,
    dataType: "cars",
  });
}
