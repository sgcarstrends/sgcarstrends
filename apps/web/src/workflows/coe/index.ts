import { generateBlogContent, getCoeForMonth } from "@sgcarstrends/ai";
import { redis, tokeniser } from "@sgcarstrends/utils";
import { getCoeMonthlyRevalidationTags } from "@web/lib/cache-tags";
import type { UpdaterResult } from "@web/lib/updater";
import { getCOELatestRecord } from "@web/queries/coe/latest-month";
import { getExistingPostByMonth } from "@web/queries/posts";
import { updateCoe } from "@web/workflows/coe/steps/process-data";
import { revalidatePostsCache } from "@web/workflows/shared";
import { revalidateTag } from "next/cache";
import { FatalError, fetch, RetryableError } from "workflow";

interface CoeWorkflowPayload {
  month?: string;
}

interface CoeWorkflowResult {
  message: string;
  postId?: string;
}

/**
 * COE data workflow using Vercel WDK.
 * Processes COE bidding data and generates blog posts.
 */
export async function coeWorkflow(
  _payload: CoeWorkflowPayload,
): Promise<CoeWorkflowResult> {
  "use workflow";

  globalThis.fetch = fetch;

  const result = await processCoeData();

  if (result.recordsProcessed === 0) {
    return {
      message: "No COE records processed. Skipped publishing to social media.",
    };
  }

  const record = await getLatestRecord();
  if (!record) {
    return { message: "[COE] No COE records found" };
  }

  const { month, biddingNo } = record;
  const year = month.split("-")[0];

  await revalidateCoeCache(month, year);

  // Only generate blog post when both bidding exercises are complete
  if (biddingNo !== 2) {
    return {
      message:
        "[COE] Data processed. Waiting for second bidding exercise to generate post.",
    };
  }

  const existingPost = await checkExistingCoePost(month);
  if (existingPost) {
    return {
      message:
        "[COE] Data processed. Post already exists, skipping social media.",
    };
  }

  const coeData = await fetchCoeData(month);
  const post = await generateCoePost(coeData, month);

  await revalidatePostsCache();

  return {
    message: "[COE] Data processed and cache revalidated successfully",
    postId: post.postId,
  };
}

async function processCoeData(): Promise<UpdaterResult> {
  "use step";

  const result = await updateCoe();

  if (result.recordsProcessed > 0) {
    await redis.set("last_updated:coe", Date.now());
  }

  return result;
}
processCoeData.maxRetries = 3;

async function getLatestRecord(): Promise<{
  month: string;
  biddingNo: number;
} | null> {
  "use step";

  const record = await getCOELatestRecord();
  return record ?? null;
}

async function revalidateCoeCache(month: string, year: string): Promise<void> {
  "use step";

  const tags = getCoeMonthlyRevalidationTags(month, year);
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
}

async function checkExistingCoePost(
  month: string,
): Promise<{ id: string } | null> {
  "use step";

  const [existingPost] = await getExistingPostByMonth(month, "coe");
  return existingPost ?? null;
}

async function fetchCoeData(month: string) {
  "use step";
  return getCoeForMonth(month);
}

async function generateCoePost(
  coeData: Awaited<ReturnType<typeof getCoeForMonth>>,
  month: string,
) {
  "use step";

  const data = tokeniser(coeData);

  try {
    return await generateBlogContent({ data, month, dataType: "coe" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("429")) {
      throw new RetryableError("AI rate limited", { retryAfter: "1m" });
    }
    if (message.includes("401") || message.includes("403")) {
      throw new FatalError("AI authentication failed");
    }
    throw error;
  }
}
generateCoePost.maxRetries = 3;
