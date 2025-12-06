import type { WorkflowContext } from "@upstash/workflow";

interface RevalidateCacheResult {
  success: boolean;
  tags: string[];
  error?: string;
}

/**
 * Revalidates web app cache for updated data.
 * This step is non-blocking - failures are logged but won't fail the workflow.
 */
export const revalidateCache = async (
  context: WorkflowContext,
  tags: string[],
): Promise<RevalidateCacheResult> => {
  return context.run("Revalidate cache", async () => {
    try {
      const webUrl = process.env.NEXT_PUBLIC_SITE_URL;
      const revalidateToken = process.env.NEXT_PUBLIC_REVALIDATE_TOKEN;

      if (!revalidateToken) {
        console.warn(
          "[WORKFLOW] NEXT_PUBLIC_REVALIDATE_TOKEN not set, skipping cache invalidation",
        );
        return { success: false, tags, error: "Missing revalidate token" };
      }

      const response = await fetch(`${webUrl}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-token": revalidateToken,
        },
        body: JSON.stringify({ tags }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(
          `[WORKFLOW] Cache invalidation failed: ${response.status} ${error}`,
        );
        return { success: false, tags, error: `${response.status}: ${error}` };
      }

      const result = await response.json();
      console.log(
        `[WORKFLOW] Cache invalidated successfully for tags: ${tags.join(", ")}`,
        result,
      );
      return { success: true, tags };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("[WORKFLOW] Error invalidating cache:", errorMessage);
      return { success: false, tags, error: errorMessage };
    }
  });
};
