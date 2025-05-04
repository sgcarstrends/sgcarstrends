import { Hono } from "hono";
import { RestliClient } from "linkedin-api-client";
import { Resource } from "sst";

const linkedin = new Hono();

const accessToken = Resource.LINKEDIN_ACCESS_TOKEN.value;

linkedin.post("/post", async (c) => {
  if (!accessToken) {
    return c.text("Access token and message are required", 400);
  }

  const UGC_POSTS_RESOURCE = "/ugcPosts";
  const PLACEHOLDER_TEXT =
    "Automated test post. More info: https://sgcarstrends.com/cars";

  try {
    const restliClient = new RestliClient();
    restliClient.setDebugParams({ enabled: true });
    const response = await restliClient.create({
      resourcePath: UGC_POSTS_RESOURCE,
      entity: {
        author: `urn:li:organization:${Resource.LINKEDIN_ORGANISATION_ID.value}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: PLACEHOLDER_TEXT + Date.now(),
            },
            shareMediaCategory: "ARTICLE",
            media: [
              {
                status: "READY",
                originalUrl: "https://sgcarstrends.com/cars",
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

    const { createdEntityId } = response;
    console.log({ createdEntityId });

    await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Resource.LINKEDIN_ACCESS_TOKEN.value}`,
        "LinkedIn-Version": "202504",
      },
      body: JSON.stringify({
        author: `urn:li:person:${Resource.LINKEDIN_USER_ID.value}`,
        commentary: "Automated reshare post",
        visibility: "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
        reshareContext: {
          parent: createdEntityId,
        },
      }),
    })
      .then((response) => response.json())
      .catch((error) => console.error(error));

    return c.json({ createdEntityId });
  } catch (error) {
    console.error(error);
    return c.json(error, 500);
  }
});

export { linkedin };
