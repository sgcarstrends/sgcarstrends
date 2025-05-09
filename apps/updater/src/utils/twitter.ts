/**
 * Post a tweet using Twitter API v2
 *
 * @param message - The tweet content
 * @returns The response from Twitter API
 */
export const postTweet = async (message: string) => {
  console.log({ message });

  try {
    console.log("TEST");
  } catch (error) {
    console.error("Error posting tweet:", error);
    throw new Error(`Failed to post tweet: ${error.message}`);
  }
};
