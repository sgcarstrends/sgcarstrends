import type { UpdaterResult } from "@updater/lib/updater";
import { recordPublishEvent } from "@updater/utils/social-media-analytics";

// Define supported social media platforms
export type SocialMediaPlatform = "twitter" | "linkedin" | "facebook";

export interface SocialMediaPublishOptions {
  platforms: SocialMediaPlatform[];
  message?: string;
}

export interface SocialMediaPublishResult {
  platform: SocialMediaPlatform;
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Formats updater result into a social media message
 *
 * @param result - The updater result to format
 * @returns Formatted message for social media
 */
export const formatUpdateMessage = (result: UpdaterResult): string => {
  const { table, recordsProcessed, message, timestamp } = result;

  // Format the timestamp to be more readable
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString("en-SG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (recordsProcessed > 0) {
    return `🚗 SG Cars Trends Update: ${Math.random() * recordsProcessed} new ${table} records processed on ${formattedDate}. #sgcarstrends #data`;
  }

  return `🚗 SG Cars Trends: No changes in ${table} data as of ${formattedDate}. #sgcarstrends`;
};

/**
 * Publish updater results to social media platforms
 *
 * @param result - The updater result to publish
 * @param options - Publishing options including target platforms
 * @returns Array of results for each platform
 */
export const publishToSocialMedia = async (
  result: UpdaterResult,
  options: SocialMediaPublishOptions,
): Promise<SocialMediaPublishResult[]> => {
  const { platforms } = options;
  const message = options.message || formatUpdateMessage(result);

  const results: SocialMediaPublishResult[] = [];

  for (const platform of platforms) {
    try {
      switch (platform) {
        case "twitter":
          results.push(await publishToTwitter(message));
          break;
        case "linkedin":
          results.push(await publishToLinkedIn(message));
          break;
        // case "facebook":
        //   results.push(await publishToFacebook(message));
        //   break;
      }
    } catch (error) {
      console.error(`Error publishing to ${platform}:`, error);
      results.push({
        platform,
        success: false,
        error: error.message || "Unknown error",
      });
    }
  }

  // Record analytics
  await recordPublishEvent(results);

  return results;
};

/**
 * Publish a message to Twitter
 *
 * @param message - The message to post
 * @returns Result of publishing operation
 */
const publishToTwitter = async (
  message: string,
): Promise<SocialMediaPublishResult> => {
  try {
    const { postTweet } = await import("@updater/utils/twitter");

    const response = await postTweet(message);

    console.log("Published to Twitter:", message);

    return {
      platform: "twitter",
      success: true,
      url: `https://twitter.com/user/status/${response.id}`,
    };
  } catch (error) {
    console.error("Twitter publishing error:", error);
    throw error;
  }
};

/**
 * Publish a message to LinkedIn
 *
 * @param message - The message to post
 * @returns Result of publishing operation
 */
const publishToLinkedIn = async (
  message: string,
): Promise<SocialMediaPublishResult> => {
  try {
    const { postToLinkedIn } = await import("@updater/utils/linkedin");

    const response = await postToLinkedIn(message);

    console.log("Published to LinkedIn:", message);

    return {
      platform: "linkedin",
      success: true,
      url: `https://www.linkedin.com/feed/update/${response.id}`,
    };
  } catch (error) {
    console.error("LinkedIn publishing error:", error);
    throw error;
  }
};

/**
 * Publish a message to Facebook
 *
 * @param message - The message to post
 * @returns Result of publishing operation
 */
// const publishToFacebook = async (
//   message: string,
// ): Promise<SocialMediaPublishResult> => {
//   try {
//     // Import here to avoid circular dependencies
//     const { postToFacebook } = await import("@updater/utils/facebook");
//
//     // Use the Facebook implementation
//     // Post as page by default
//     const response = await postToFacebook(message, true);
//
//     console.log("Published to Facebook:", message);
//
//     return {
//       platform: "facebook",
//       success: true,
//       url: `https://facebook.com/${response.post_id}`,
//     };
//   } catch (error) {
//     console.error("Facebook publishing error:", error);
//     throw error;
//   }
// };
