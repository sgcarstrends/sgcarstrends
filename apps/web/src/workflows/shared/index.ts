import { socialMediaManager } from "@web/config/platforms";
import { revalidateTag } from "next/cache";

/**
 * Publish update to all enabled social media platforms.
 */
export async function publishToSocialMedia(
  title: string,
  link: string,
): Promise<void> {
  "use step";

  console.log("Publishing to all enabled platforms");

  const result = await socialMediaManager.publishToAll({
    message: `📰 New Blog Post: ${title}`,
    link,
  });

  console.log(
    `Publishing complete: ${result.successCount} successful, ${result.errorCount} failed`,
  );
}

/**
 * Revalidate posts cache after publishing.
 */
export async function revalidatePostsCache(): Promise<void> {
  "use step";

  revalidateTag("posts:list", "max");
  console.log("[WORKFLOW] Posts cache invalidated");
}
