import type { WorkflowContext } from "@upstash/workflow";
import type { SocialMessage } from "@web/lib/social/interfaces/platform-handler";
import type {
  PublishResults,
  SocialMediaManager,
} from "@web/lib/social/social-media-manager";

/**
 * Publish updates to all enabled social media platforms
 */
export const publishToAllPlatforms = async (
  context: WorkflowContext,
  socialMediaManager: SocialMediaManager,
  message: SocialMessage,
): Promise<PublishResults> => {
  return context.run("Publish to social media", async () => {
    console.log("Publishing to all enabled platforms");

    const result = await socialMediaManager.publishToAll(message);

    console.log(
      `Publishing complete: ${result.successCount} successful, ${result.errorCount} failed`,
    );

    return result;
  });
};
