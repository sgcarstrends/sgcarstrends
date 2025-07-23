import type { PostToTwitterParam } from "@api/types/social-media";
import { Resource } from "sst";
import { TwitterApi } from "twitter-api-v2";

/**
 * Post to Twitter
 */
export const postToTwitter = async ({ message, link }: PostToTwitterParam) => {
  if (!message) {
    throw new Error("Tweet cannot be empty.");
  }

  // Get Twitter API credentials
  const appKey = process.env.TWITTER_APP_KEY;
  const appSecret = process.env.TWITTER_APP_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  // Validate credentials
  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    throw new Error("Twitter API credentials are required");
  }

  try {
    const twitterClient = new TwitterApi({
      appKey,
      appSecret,
      accessToken,
      accessSecret,
    });

    const result = await twitterClient.v2.tweet({ text: `${message} ${link}` });
    console.log("Tweet posted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error posting tweet:", error);
    throw new Error(error);
  }
};
