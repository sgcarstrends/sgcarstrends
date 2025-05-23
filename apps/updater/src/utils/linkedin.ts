import { RestliClient } from "linkedin-api-client";
import { Resource } from "sst";

interface LinkedInCredentials {
  accessToken: string;
}

interface LinkedInResponse {
  id: string;
  organisationId?: string;
}

/**
 * Refreshes LinkedIn access token using refresh token
 *
 * @returns Fresh access token
 */
export const refreshLinkedInToken = async (): Promise<string> => {
  const clientId = Resource.LINKEDIN_CLIENT_ID.value;
  const clientSecret = Resource.LINKEDIN_CLIENT_SECRET.value;
  const refreshToken = Resource.LINKEDIN_REFRESH_TOKEN.value;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("LinkedIn credentials not configured");
  }

  const tokenResponse = await fetch(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    },
  );

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("[LinkedIn] Token refresh failed:", errorText);
    throw new Error("Failed to refresh LinkedIn token");
  }

  const tokenData = (await tokenResponse.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
  };

  return tokenData.access_token;
};

/**
 * Get LinkedIn API credentials from environment variables
 *
 * @returns LinkedIn API credentials
 */
export const getLinkedInCredentials = (): LinkedInCredentials => ({
  accessToken: Resource.LINKEDIN_ACCESS_TOKEN.value,
});

/**
 * Post a share to LinkedIn
 *
 * @param message - The content to share
 * @param isCompanyPost - Whether to post as company or individual
 * @returns The response from LinkedIn API
 */
export const postToLinkedIn = async (message: string, isCompanyPost = true) => {
  const { accessToken } = getLinkedInCredentials();
  if (!accessToken) {
    throw new Error("LinkedIn access token is missing");
  }

  const UGC_POSTS_RESOURCE = "/ugcPosts";

  try {
    const restliClient = new RestliClient();
    restliClient.setDebugParams({ enabled: true });
    const accessToken = Resource.LINKEDIN_ACCESS_TOKEN.value;

    // TODO: Used for auto-reposting in the future
    // const me = await restliClient.get({
    //   resourcePath: USERINFO_RESOURCE,
    //   accessToken,
    // });

    const PLACEHOLDER_TEXT =
      "Automated test post. More info: https://sgcarstrends.com/cars";
    const response = await restliClient.create({
      resourcePath: UGC_POSTS_RESOURCE,
      entity: {
        author: `urn:li:organization:${Resource.LINKEDIN_ORGANISATION_ID.value}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: PLACEHOLDER_TEXT,
            },
            shareMediaCategory: "ARTICLE",
            media: [
              {
                status: "READY",
                originalUrl:
                  "https://blog.google/products/search/google-year-in-search-video-breakouts/",
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      accessToken,
    });
    console.log(response);

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "X-Restli-Protocol-Version": "2.0.0",
    "LinkedIn-Version": "202504",
    "Content-Type": "application/json",
  };

  try {
    console.log("Posting to LinkedIn:", { message, isCompanyPost });

    if (isCompanyPost) {
      const organisationId = Resource.LINKEDIN_ORGANISATION_ID.value;

      const payload = {
        author: `urn:li:organization:${organisationId}`,
        commentary: message,
        visibility: "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        content: {
          article: {
            source: "https://sgcarstrends.com/cars",
            // thumbnail: "urn:li:image:C49klciosC89",
            title: "SG Cars Trends",
            description: "Monthly car registrations",
          },
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      };

      const response = await fetch("https://api.linkedin.com/rest/posts", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        new Error(`LinkedIn shares API error ${response.status} ${error}`);
      }

      return response.json();
    }

    // const meRes = await fetch("https://api.linkedin.com/v2/me", {
    //   method: "GET",
    //   headers,
    // });
    // if (!meRes.ok) {
    //   const err = await meRes.text();
    //   new Error(`LinkedIn /me API error ${meRes.status}: ${err}`);
    // }
    // const meData = await meRes.json();
    // const author = `urn:li:person:${meData.id}`;
    //
    // const ugcPayload = {
    //   author,
    //   lifecycleState: "PUBLISHED",
    //   specificContent: {
    //     "com.linkedin.ugc.ShareContent": {
    //       shareCommentary: { text: message },
    //       shareMediaCategory: "NONE",
    //     },
    //   },
    //   visibility: {
    //     "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    //   },
    // };
    //
    // const ugcRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    //   method: "POST",
    //   headers,
    //   body: JSON.stringify(ugcPayload),
    // });
    //
    // if (!ugcRes.ok) {
    //   const err = await ugcRes.text();
    //   new Error(`LinkedIn ugcPosts API error ${ugcRes.status}: ${err}`);
    // }
    //
    // const ugcData = await ugcRes.json();
    // return { id: ugcData.id };
  } catch (error) {
    console.error("Error posting to LinkedIn:", error);
    throw new Error(`Failed to post to LinkedIn: ${error.message}`);
  }
};
