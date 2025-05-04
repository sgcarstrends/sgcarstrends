import { type LICreateResponse, RestliClient } from "linkedin-api-client";
import { Resource } from "sst";

const UGC_POSTS_RESOURCE = "/ugcPosts";
const PLACEHOLDER_TEXT =
  "Automated test post. More info: https://sgcarstrends.com/cars";

export const postToLinkedin = async (): Promise<
  LICreateResponse["createdEntityId"]
> => {
  const accessToken = Resource.LINKEDIN_ACCESS_TOKEN.value;

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
    return createdEntityId;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  } finally {
    console.log("Posted to LinkedIn company's page");
  }
};
