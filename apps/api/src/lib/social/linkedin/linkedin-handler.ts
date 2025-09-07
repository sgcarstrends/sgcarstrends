import { Stage } from "@api/types";
import { Platform } from "@api/types/social-media";
import { refreshLinkedInToken } from "@api/utils/linkedin";
import { RestliClient } from "linkedin-api-client";
import type {
  PlatformConfig,
  PlatformHandler,
  PlatformHealth,
  PublishResult,
  SocialMessage,
} from "../interfaces/platform-handler";
import { resharePost } from "./reshare-post";

const UGC_POSTS_RESOURCE = "/ugcPosts";

export class LinkedInHandler implements PlatformHandler {
  readonly platform = Platform.LinkedIn;

  readonly config: PlatformConfig = {
    enabled: process.env.STAGE === Stage.PRODUCTION,
    requiredEnvVars: [
      "LINKEDIN_ACCESS_TOKEN",
      "LINKEDIN_ORGANISATION_ID",
      "LINKEDIN_CLIENT_ID",
      "LINKEDIN_CLIENT_SECRET",
      "LINKEDIN_REFRESH_TOKEN",
    ],
  };

  async publish({ message, link }: SocialMessage): Promise<PublishResult> {
    if (!message) {
      return {
        success: false,
        error: "LinkedIn message cannot be empty",
      };
    }

    if (!this.validateConfiguration()) {
      return {
        success: false,
        error: "LinkedIn configuration is incomplete",
      };
    }

    try {
      // Get fresh access token
      const accessToken = await refreshLinkedInToken();

      const restliClient = new RestliClient();
      restliClient.setDebugParams({ enabled: true });

      const response = await restliClient.create({
        resourcePath: UGC_POSTS_RESOURCE,
        entity: {
          author: `urn:li:organization:${process.env.LINKEDIN_ORGANISATION_ID}`,
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

      if (!createdEntityId) {
        return {
          success: false,
          error: "LinkedIn API did not return a created entity ID",
          platformResponse: response,
        };
      }

      // Reshare the post
      try {
        await resharePost({ createdEntityId, accessToken });
      } catch (reshareError) {
        // Log reshare error but don't fail the entire post
        console.warn("LinkedIn reshare failed:", reshareError);
      }

      return {
        success: true,
        data: { createdEntityId },
        platformResponse: response,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `LinkedIn API error: ${errorMessage}`,
      };
    }
  }

  async healthCheck(): Promise<PlatformHealth> {
    const lastChecked = new Date();

    if (!this.validateConfiguration()) {
      return {
        platform: this.platform,
        healthy: false,
        error: "Missing required LinkedIn configuration",
        lastChecked,
      };
    }

    try {
      // Test token refresh to verify API connectivity
      await refreshLinkedInToken();

      return {
        platform: this.platform,
        healthy: true,
        lastChecked,
      };
    } catch (error) {
      return {
        platform: this.platform,
        healthy: false,
        error: error instanceof Error ? error.message : String(error),
        lastChecked,
      };
    }
  }

  validateConfiguration(): boolean {
    return this.config.requiredEnvVars.every((envVar) =>
      Boolean(process.env[envVar]),
    );
  }
}
