import type { LICreateResponse } from "linkedin-api-client";
import { Resource } from "sst";

export const resharePost = async (
  createdEntityId: LICreateResponse["createdEntityId"],
) => {
  try {
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
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  } finally {
    console.log("Reshared page post to personal account");
  }
};
