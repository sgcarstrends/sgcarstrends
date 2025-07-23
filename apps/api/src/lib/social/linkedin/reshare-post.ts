import type { ResharePostParam } from "@api/types/social-media";
import { Resource } from "sst";

export const resharePost = async ({
  createdEntityId,
  message,
  accessToken,
}: ResharePostParam & { accessToken: string }) => {
  try {
    await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202504",
      },
      body: JSON.stringify({
        author: `urn:li:person:${process.env.LINKEDIN_USER_ID}`,
        commentary: message ?? "",
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
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  } finally {
    console.log("Reshared page post to personal account");
  }
};
