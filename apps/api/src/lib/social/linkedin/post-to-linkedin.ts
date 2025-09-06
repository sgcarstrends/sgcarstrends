import { resharePost } from "@api/lib/social/linkedin/reshare-post";
import type {
  CreatedEntityId,
  PostToLinkedInParam,
} from "@api/types/social-media";
import { refreshLinkedInToken } from "@api/utils/linkedin";
import { RestliClient } from "linkedin-api-client";

const UGC_POSTS_RESOURCE = "/ugcPosts";

export const postToLinkedin = async ({
  message,
  link,
}: PostToLinkedInParam): Promise<CreatedEntityId> => {
  let accessToken = process.env.LINKEDIN_ACCESS_TOKEN as string;

  try {
    // Get fresh access token
    accessToken = await refreshLinkedInToken();
    console.log("LinkedIn token refreshed successfully");

    const restliClient = new RestliClient();
    restliClient.setDebugParams({ enabled: true });
    const response = await restliClient.create({
      resourcePath: UGC_POSTS_RESOURCE,
      entity: {
        author: `urn:li:organization:${process.env.LINKEDIN_ORGANISATION_ID as string}`,
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
