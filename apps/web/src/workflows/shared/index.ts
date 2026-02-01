import { revalidateTag } from "next/cache";

/**
 * Revalidate posts cache after publishing.
 */
export async function revalidatePostsCache(): Promise<void> {
  "use step";

  revalidateTag("posts:list", "max");
  console.log("[WORKFLOW] Posts cache invalidated");
}
