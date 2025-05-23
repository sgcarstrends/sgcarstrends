import { resharePost } from "@updater/lib/linkedin/reshare-post";
import type {
  CreatedEntityId,
  PostToLinkedInParam,
} from "@updater/types/social-media";
import { refreshLinkedInToken } from "@updater/utils/linkedin";
import { RestliClient } from "linkedin-api-client";
import { Resource } from "sst";

const UGC_POSTS_RESOURCE = "/ugcPosts";

export const postToLinkedin = async ({
  message,
  link,
}: PostToLinkedInParam): Promise<CreatedEntityId> => {
  let accessToken = Resource.LINKEDIN_ACCESS_TOKEN.value;

  try {
    // Get fresh access token
    accessToken = await refreshLinkedInToken();
    console.log("LinkedIn token refreshed successfully");

    const restliClient = new RestliClient();
    restliClient.setDebugParams({ enabled: true });
    const response = await restliClient.create({
      resourcePath: UGC_POSTS_RESOURCE,
      entity: {
        author: `urn:li:organization:${Resource.LINKEDIN_ORGANISATION_ID.value}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: message },
            shareMediaCategory: "ARTICLE",
            media: [
              {
                status: "READY",
                originalUrl: link,
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

    if (createdEntityId) {
      await resharePost({ createdEntityId, accessToken });
    }

    return createdEntityId;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  } finally {
    console.log("Posted to LinkedIn company's page");
  }
};
