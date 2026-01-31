import {
  getCarsAggregatedByMonth,
  getCoeForMonth,
  regenerateBlogContent,
} from "@sgcarstrends/ai";
import { tokeniser } from "@sgcarstrends/utils";
import { fetch } from "workflow";
import { revalidatePostsCache } from "./shared";

interface RegeneratePostPayload {
  month: string;
  dataType: "cars" | "coe";
}

interface RegeneratePostResult {
  message: string;
  postId?: string;
  title?: string;
  slug?: string;
}

/**
 * Regenerate post workflow using Vercel WDK.
 * Forces regeneration of a blog post for a specific month and data type.
 * Does not publish to social media (regeneration is for content updates only).
 */
export async function regeneratePostWorkflow(
  payload: RegeneratePostPayload,
): Promise<RegeneratePostResult> {
  "use workflow";

  // Enable WDK's durable fetch for AI SDK
  globalThis.fetch = fetch;

  const { month, dataType } = payload;

  // Step 1: Fetch data
  const data = await fetchData(month, dataType);

  // Step 2: Generate blog content
  const post = await generatePost(data, month, dataType);

  // Step 3: Revalidate posts cache
  await revalidatePostsCache();

  return {
    message: `[REGENERATE] Successfully regenerated ${dataType} post for ${month}`,
    postId: post.postId,
    title: post.title,
    slug: post.slug,
  };
}

async function fetchData(
  month: string,
  dataType: "cars" | "coe",
): Promise<string> {
  "use step";
  console.log(`Fetching ${dataType} data for ${month}`);

  if (dataType === "cars") {
    const cars = await getCarsAggregatedByMonth(month);
    return tokeniser(cars);
  }

  const coe = await getCoeForMonth(month);
  return tokeniser(coe);
}

async function generatePost(
  data: string,
  month: string,
  dataType: "cars" | "coe",
) {
  "use step";
  console.log(`Generating ${dataType} blog content for ${month}`);

  return regenerateBlogContent({
    data,
    month,
    dataType,
  });
}
