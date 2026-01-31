import { generateBlogContent, getCoeForMonth } from "@sgcarstrends/ai";
import { redis, tokeniser } from "@sgcarstrends/utils";
import { SITE_URL } from "@web/config";
import type { UpdaterResult } from "@web/lib/updater";
import { updateCoe } from "@web/lib/workflows/update-coe";
import { getCOELatestRecord } from "@web/queries/coe/latest-month";
import { getExistingPostByMonth } from "@web/queries/posts";
import { revalidateTag } from "next/cache";
import { fetch, getStepMetadata } from "workflow";
import { handleStepError } from "./error-handling";
import { publishToSocialMedia, revalidatePostsCache } from "./shared";

interface CoeWorkflowPayload {
  month?: string;
}

interface CoeWorkflowResult {
  message: string;
  postId?: string;
}

/**
 * COE data workflow using Vercel WDK.
 * Processes COE bidding data, generates blog posts, and publishes to social media.
 */
export async function coeWorkflow(
  _payload: CoeWorkflowPayload,
): Promise<CoeWorkflowResult> {
  "use workflow";

  // Enable WDK's durable fetch for AI SDK
  globalThis.fetch = fetch;

  // Step 1: Process COE data (both COE results and PQP)
  const result = await processCoeData();

  if (result.recordsProcessed === 0) {
    return {
      message: "No COE records processed. Skipped publishing to social media.",
    };
  }

  // Step 2: Get latest record from database
  const record = await getLatestRecord();
  if (!record) {
    return { message: "[COE] No COE records found" };
  }

  const { month, biddingNo } = record;
  const year = month.split("-")[0];

  // Step 3: Revalidate data cache
  await revalidateCoeCache(year);

  // Only generate blog post when both bidding exercises are complete
  if (biddingNo !== 2) {
    return {
      message:
        "[COE] Data processed. Waiting for second bidding exercise to generate post.",
    };
  }

  // Step 4: Check if post already exists
  const existingPost = await checkExistingCoePost(month);
  if (existingPost) {
    return {
      message:
        "[COE] Data processed. Post already exists, skipping social media.",
    };
  }

  // Step 5: Fetch COE data for blog generation
  const coeData = await fetchCoeData(month);

  // Step 6: Generate blog post
  const post = await generateCoePost(coeData, month);

  // Step 7: Publish to social media
  const link = `${SITE_URL}/blog/${post.slug}`;
  await publishToSocialMedia(post.title, link);

  // Step 8: Revalidate posts cache
  await revalidatePostsCache();

  return {
    message: "[COE] Data processed and cache revalidated successfully",
    postId: post.postId,
  };
}

/**
 * Process COE data from LTA DataMall and update database.
 * Updates both COE bidding results and PQP tables.
 */
async function processCoeData(): Promise<UpdaterResult> {
  "use step";

  const metadata = getStepMetadata();
  console.log(`Processing COE data (attempt ${metadata.attempt})`);

  try {
    const result = await updateCoe();

    if (result.recordsProcessed > 0) {
      const now = Date.now();
      await redis.set("last_updated:coe", now);
      console.log("Last updated coe:", now);
    } else {
      console.log("No changes for coe");
    }

    return result;
  } catch (error) {
    handleStepError(error, { category: "lta-datamall", context: "COE" });
  }
}
processCoeData.maxRetries = 3;

/**
 * Get the latest COE record from the database.
 */
async function getLatestRecord(): Promise<{
  month: string;
  biddingNo: number;
} | null> {
  "use step";

  try {
    const record = await getCOELatestRecord();
    return record ?? null;
  } catch (error) {
    handleStepError(error, { category: "database", context: "COE" });
  }
}

/**
 * Revalidate Next.js cache tags for COE data.
 */
async function revalidateCoeCache(year: string): Promise<void> {
  "use step";

  const tags = ["coe:latest", "coe:months", `coe:year:${year}`];

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  console.log(`[WORKFLOW] Cache invalidated for tags: ${tags.join(", ")}`);
}

/**
 * Check if a blog post already exists for the given month.
 */
async function checkExistingCoePost(
  month: string,
): Promise<{ id: string } | null> {
  "use step";

  try {
    const [existingPost] = await getExistingPostByMonth(month, "coe");
    return existingPost ?? null;
  } catch (error) {
    handleStepError(error, { category: "database", context: "COE" });
  }
}

/**
 * Fetch COE data for blog generation.
 */
async function fetchCoeData(month: string) {
  "use step";

  try {
    return await getCoeForMonth(month);
  } catch (error) {
    handleStepError(error, { category: "database", context: "COE" });
  }
}

/**
 * Generate a blog post from COE data.
 */
async function generateCoePost(
  coeData: Awaited<ReturnType<typeof getCoeForMonth>>,
  month: string,
) {
  "use step";

  const metadata = getStepMetadata();
  console.log(`Generating COE blog post (attempt ${metadata.attempt})`);

  try {
    const data = tokeniser(coeData);

    return await generateBlogContent({
      data,
      month,
      dataType: "coe",
    });
  } catch (error) {
    handleStepError(error, { category: "ai-generation", context: "COE" });
  }
}
generateCoePost.maxRetries = 3;
