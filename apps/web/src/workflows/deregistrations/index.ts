import {
  generateBlogContent,
  getDeregistrationsForMonth,
} from "@sgcarstrends/ai";
import { redis, tokeniser } from "@sgcarstrends/utils";
import { getDeregistrationsMonthlyRevalidationTags } from "@web/lib/cache-tags";
import type { UpdaterResult } from "@web/lib/updater";
import { getDeregistrationsLatestMonth } from "@web/queries/deregistrations/latest-month";
import { getExistingPostByMonth } from "@web/queries/posts";
import { updateDeregistration } from "@web/workflows/deregistrations/steps/process-data";
import { revalidatePostsCache } from "@web/workflows/shared";
import { revalidateTag } from "next/cache";
import { FatalError, fetch, RetryableError } from "workflow";

interface DeregistrationsWorkflowPayload {
  month?: string;
}

interface DeregistrationsWorkflowResult {
  message: string;
  postId?: string;
}

/**
 * Deregistrations data workflow using Vercel WDK.
 * Processes vehicle deregistration data, generates blog posts, and revalidates cache.
 */
export async function deregistrationsWorkflow(
  payload: DeregistrationsWorkflowPayload,
): Promise<DeregistrationsWorkflowResult> {
  "use workflow";

  globalThis.fetch = fetch;

  const result = await processDeregistrationsData();

  if (result.recordsProcessed === 0) {
    return { message: "No deregistration records processed." };
  }

  const latestMonth = payload.month ?? (await getLatestMonth());
  if (!latestMonth) {
    return { message: "No deregistration data found." };
  }

  await revalidateDeregistrationsCache(latestMonth);

  const existingPost = await checkExistingDeregistrationsPost(latestMonth);
  if (existingPost) {
    return {
      message:
        "[DEREGISTRATIONS] Data processed. Post already exists, skipping.",
    };
  }

  const deregistrationsData = await fetchDeregistrationsData(latestMonth);
  const post = await generateDeregistrationsPost(deregistrationsData, latestMonth);

  await revalidatePostsCache();

  return {
    message:
      "[DEREGISTRATIONS] Data processed and cache revalidated successfully",
    postId: post.postId,
  };
}

async function processDeregistrationsData(): Promise<UpdaterResult> {
  "use step";

  const result = await updateDeregistration();

  if (result.recordsProcessed > 0) {
    await redis.set("last_updated:deregistrations", Date.now());
  }

  return result;
}
async function getLatestMonth(): Promise<string | null> {
  "use step";

  const { month } = await getDeregistrationsLatestMonth();
  return month ?? null;
}

async function revalidateDeregistrationsCache(month: string): Promise<void> {
  "use step";

  const tags = getDeregistrationsMonthlyRevalidationTags(month);
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
}

async function checkExistingDeregistrationsPost(
  month: string,
): Promise<{ id: string } | null> {
  "use step";

  const [existingPost] = await getExistingPostByMonth(month, "deregistrations");
  return existingPost ?? null;
}

async function fetchDeregistrationsData(month: string) {
  "use step";
  return getDeregistrationsForMonth(month);
}

async function generateDeregistrationsPost(
  deregistrationsData: Awaited<ReturnType<typeof getDeregistrationsForMonth>>,
  month: string,
) {
  "use step";

  const data = tokeniser(deregistrationsData);

  try {
    return await generateBlogContent({
      data,
      month,
      dataType: "deregistrations",
    });
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
