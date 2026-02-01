import {
  generateBlogContent,
  getCarsAggregatedByMonth,
} from "@sgcarstrends/ai";
import { redis, tokeniser } from "@sgcarstrends/utils";
import { SITE_URL } from "@web/config";
import type { UpdaterResult } from "@web/lib/updater";
import { getCarsLatestMonth } from "@web/queries/cars/latest-month";
import { getExistingPostByMonth } from "@web/queries/posts";
import { updateCars } from "@web/workflows/cars/steps/process-data";
import {
  publishToSocialMedia,
  revalidatePostsCache,
} from "@web/workflows/shared";
import { revalidateTag } from "next/cache";
import { FatalError, fetch, RetryableError } from "workflow";

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

  const result = await processCarsData();

  if (result.recordsProcessed === 0) {
    return {
      message: "No car records processed. Skipped publishing to social media.",
    };
  }

  const month = await getLatestMonth();
  if (!month) {
    return { message: "[CARS] No car records found" };
  }

  await revalidateCarsCache(month);

  const existingPost = await checkExistingCarsPost(month);
  if (existingPost) {
    return {
      message:
        "[CARS] Data processed. Post already exists, skipping social media.",
    };
  }

  const carsData = await fetchCarsData(month);
  const post = await generateCarsPost(carsData, month);

  const link = `${SITE_URL}/blog/${post.slug}`;
  await publishToSocialMedia(post.title, link);
  await revalidatePostsCache();

  return {
    message: "[CARS] Data processed and cache revalidated successfully",
    postId: post.postId,
  };
}

async function processCarsData(): Promise<UpdaterResult> {
  "use step";

  const result = await updateCars();

  if (result.recordsProcessed > 0) {
    await redis.set("last_updated:cars", Date.now());
  }

  return result;
}
processCarsData.maxRetries = 3;

async function getLatestMonth(): Promise<string | null> {
  "use step";
  return getCarsLatestMonth();
}

async function revalidateCarsCache(month: string): Promise<void> {
  "use step";

  const tags = [`cars:month:${month}`, "cars:months"];
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
}

async function checkExistingCarsPost(
  month: string,
): Promise<{ id: string } | null> {
  "use step";

  const [existingPost] = await getExistingPostByMonth(month, "cars");
  return existingPost ?? null;
}

async function fetchCarsData(month: string) {
  "use step";
  return getCarsAggregatedByMonth(month);
}

async function generateCarsPost(
  carsData: Awaited<ReturnType<typeof getCarsAggregatedByMonth>>,
  month: string,
) {
  "use step";

  const data = tokeniser(carsData);

  try {
    return await generateBlogContent({ data, month, dataType: "cars" });
  } catch (error) {
    // Rate limit - wait before retry
    if (error.message?.includes("429")) {
      throw new RetryableError("AI rate limited", { retryAfter: "1m" });
    }
    // Auth error - can't succeed
    if (error.message?.includes("401") || error.message?.includes("403")) {
      throw new FatalError("AI authentication failed");
    }
    throw error;
  }
}
generateCarsPost.maxRetries = 3;
