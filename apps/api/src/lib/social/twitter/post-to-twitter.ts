import type { PostToTwitterParam } from "@api/types/social-media";
import { TwitterApi } from "twitter-api-v2";

/**
 * Post to Twitter
 */
export const postToTwitter = async ({ message, link }: PostToTwitterParam) => {
  if (!message) {
    throw new Error("Tweet cannot be empty.");
  }

  // Get Twitter API credentials
  const appKey = process.env.TWITTER_APP_KEY as string;
  const appSecret = process.env.TWITTER_APP_SECRET as string;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN as string;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET as string;

  try {
    const twitterClient = new TwitterApi({
      appKey,
      appSecret,
      accessToken,
      accessSecret,
    });

    // Twitter character limit for non-premium accounts
    const TWITTER_CHAR_LIMIT = 280;
    const fullText = `${message} ${link}`;

    let tweetText = fullText;
    if (fullText.length > TWITTER_CHAR_LIMIT) {
      // Calculate available space for message: total limit - link length - space - ellipsis
      const availableSpace = TWITTER_CHAR_LIMIT - link.length - 4; // 4 chars for " ..."
      if (availableSpace > 0) {
        tweetText = `${message.substring(0, availableSpace)}... ${link}`;
      } else {
        // If link is too long, just truncate the entire text
        tweetText = `${fullText.substring(0, TWITTER_CHAR_LIMIT - 3)}...`;
      }
    }

    const result = await twitterClient.v2.tweet({ text: tweetText });
    console.log("Tweet posted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error posting tweet:", error);
    throw new Error(error);
  }
};
