import type { WorkflowContext } from "@upstash/workflow";
import { revalidateTag } from "next/cache";

interface RevalidateCacheResult {
  success: boolean;
  tags: string[];
}

/**
 * Revalidates web app cache for updated data using Next.js revalidateTag directly.
 * Since workflows run inside Next.js API routes, we can call revalidateTag without HTTP.
 */
export const revalidateCache = async (
  context: WorkflowContext,
  tags: string[],
): Promise<RevalidateCacheResult> => {
  return context.run("revalidate-cache", async () => {
    for (const tag of tags) {
      revalidateTag(tag, "max");
    }
    console.log(`[WORKFLOW] Cache invalidated for tags: ${tags.join(", ")}`);
    return { success: true, tags };
  });
};
