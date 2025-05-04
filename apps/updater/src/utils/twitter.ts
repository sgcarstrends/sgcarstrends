import { Resource } from "sst";

interface TwitterCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
}

interface TwitterResponse {
  id: string;
  text: string;
}

/**
 * Get Twitter API credentials from environment variables
 *
 * @returns Twitter API credentials
 */
export const getTwitterCredentials = (): TwitterCredentials => {
  return {
    apiKey: Resource.TWITTER_API_KEY.value,
    apiSecret: Resource.TWITTER_API_SECRET.value,
    accessToken: Resource.TWITTER_ACCESS_TOKEN.value,
    accessSecret: Resource.TWITTER_ACCESS_SECRET.value,
  };
};

/**
 * Post a tweet using Twitter API v2
 *
 * @param message - The tweet content
 * @returns The response from Twitter API
 */
export const postTweet = async (message: string): Promise<TwitterResponse> => {
  const credentials = getTwitterCredentials();

  try {
    // This is a simplified implementation
    // In a real implementation, you would use proper OAuth and API calls

    console.log("Posting tweet with message:", message);
    console.log("Using credentials:", {
      apiKey: credentials.apiKey ? "****" : undefined,
      apiSecret: credentials.apiSecret ? "****" : undefined,
      accessToken: credentials.accessToken ? "****" : undefined,
      accessSecret: credentials.accessSecret ? "****" : undefined,
    });

    // Mock API call - Replace with actual API implementation
    // const response = await fetch("https://api.twitter.com/2/tweets", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${authToken}`,
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({ text: message })
    // });

    // const data = await response.json();

    // Simulate successful response
    return {
      id: "12345678901234567890",
      text: message,
    };
  } catch (error) {
    console.error("Error posting tweet:", error);
    throw new Error(`Failed to post tweet: ${error.message}`);
  }
};
