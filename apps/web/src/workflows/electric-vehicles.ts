import { generateBlogContent, getEvDataForMonth } from "@sgcarstrends/ai";
import { tokeniser } from "@sgcarstrends/utils";
import { getCarsLatestMonth } from "@web/queries/cars/latest-month";
import { getExistingPostByMonth } from "@web/queries/posts";
import {
  emitEvent,
  handleAIError,
  revalidatePostsCache,
} from "@web/workflows/shared";
import { fetch } from "workflow";

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

  await emitEvent({ type: "step:start", step: "fetchEvData" });
  const evData = await fetchEvData(month);
  await emitEvent({
    type: "data:processed",
    step: "fetchEvData",
    data: { recordCount: evData.length },
  });

  if (evData.length === 0) {
    return { message: "[EV] No EV data for this month." };
  }

  await emitEvent({ type: "step:start", step: "generateEvPost" });
  const post = await generateEvPost(evData, month);
  await emitEvent({
    type: "post:generated",
    step: "generateEvPost",
    data: { postId: post.postId },
  });

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
    handleAIError(error);
  }
}
