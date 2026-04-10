import {
  generateBlogContent,
  getEvDataForMonth,
} from "@sgcarstrends/ai";
import { tokeniser } from "@sgcarstrends/utils";
import { getCarsLatestMonth } from "@web/queries/cars/latest-month";
import { getExistingPostByMonth } from "@web/queries/posts";
import { revalidatePostsCache } from "@web/workflows/shared";
import { FatalError, fetch, RetryableError } from "workflow";

interface ElectricVehiclesWorkflowPayload {
  month?: string;
}

interface ElectricVehiclesWorkflowResult {
  message: string;
  postId?: string;
}

/**
 * Electric vehicles blog workflow using Vercel WDK.
 * Generates blog posts from EV registration data.
 */
export async function electricVehiclesWorkflow(
  payload: ElectricVehiclesWorkflowPayload,
): Promise<ElectricVehiclesWorkflowResult> {
  "use workflow";

  globalThis.fetch = fetch;

  const month = payload.month ?? (await getLatestMonth());
  if (!month) {
    return { message: "[EV] No car data found." };
  }

  const existingPost = await checkExistingEvPost(month);
  if (existingPost) {
    return { message: "[EV] Post already exists, skipping." };
  }

  const evData = await fetchEvData(month);
  if (evData.length === 0) {
    return { message: "[EV] No EV data for this month." };
  }

  const post = await generateEvPost(evData, month);

  await revalidatePostsCache();

  return {
    message: "[EV] Blog post generated successfully",
    postId: post.postId,
  };
}

async function getLatestMonth(): Promise<string | null> {
  "use step";
  return getCarsLatestMonth();
}

async function checkExistingEvPost(
  month: string,
): Promise<{ id: string } | null> {
  "use step";

  const [existingPost] = await getExistingPostByMonth(
    month,
    "electric-vehicles",
  );
  return existingPost ?? null;
}

async function fetchEvData(month: string) {
  "use step";
  return getEvDataForMonth(month);
}

async function generateEvPost(
  evData: Awaited<ReturnType<typeof getEvDataForMonth>>,
  month: string,
) {
  "use step";

  const data = tokeniser(evData);

  try {
    return await generateBlogContent({
      data,
      month,
      dataType: "electric-vehicles",
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
