/**
 * Revalidates web app cache for updated data
 */
export const revalidateWebCache = async (
  tags: string[],
): Promise<{ success: boolean; error?: string }> => {
  try {
    const webUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://sgcarstrends.com";
    const revalidateToken = process.env.NEXT_PUBLIC_REVALIDATE_TOKEN;

    if (!revalidateToken) {
      console.warn(
        "[ADMIN] NEXT_PUBLIC_REVALIDATE_TOKEN not set, skipping cache invalidation",
      );
      return {
        success: false,
        error: "Revalidate token not configured",
      };
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
        `[ADMIN] Cache invalidation failed: ${response.status} ${error}`,
      );
      return {
        success: false,
        error: `Cache invalidation failed: ${response.status}`,
      };
    }

    const result = await response.json();
    console.log(
      `[ADMIN] Cache invalidated successfully for tags: ${tags.join(", ")}`,
      result,
    );

    return { success: true };
  } catch (error) {
    console.error(
      "[ADMIN] Error invalidating cache:",
      error instanceof Error ? error.message : String(error),
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
