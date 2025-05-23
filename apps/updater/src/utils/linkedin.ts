import { Resource } from "sst";

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
