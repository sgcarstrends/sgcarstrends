import { Resource } from "sst";
import { TwitterApi } from "twitter-api-v2";

/**
 * Post to Twitter
 *
 * @param message
 */
export const postToTwitter = async (message: string) => {
  if (!message) {
    throw new Error("Tweet cannot be empty.");
  }

  // Get Twitter API credentials
  const appKey = Resource.TWITTER_APP_KEY.value;
  const appSecret = Resource.TWITTER_APP_SECRET.value;
  const accessToken = Resource.TWITTER_ACCESS_TOKEN.value;
  const accessSecret = Resource.TWITTER_ACCESS_SECRET.value;

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

    const result = await twitterClient.v2.tweet({ text: message });
    console.log("Tweet posted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error posting tweet:", error);
    throw new Error(error);
  }
};
