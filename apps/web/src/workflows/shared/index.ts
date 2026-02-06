import { getPostsWorkflowRevalidationTags } from "@web/lib/cache-tags";
import { revalidateTag } from "next/cache";

/**
 * Revalidate posts cache after publishing.
 */
export async function revalidatePostsCache(): Promise<void> {
  "use step";

  for (const tag of getPostsWorkflowRevalidationTags()) {
    revalidateTag(tag, "max");
  }
  console.log("[WORKFLOW] Posts cache invalidated");
}
