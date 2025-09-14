import { Stage } from "@api/types";
import { Platform } from "@api/types/social-media";
import { TwitterApi } from "twitter-api-v2";
import type {
  PlatformConfig,
  PlatformHandler,
  PlatformHealth,
  PublishResult,
  SocialMessage,
} from "../interfaces/platform-handler";

const TWITTER_CHAR_LIMIT = 280;

export class TwitterHandler implements PlatformHandler {
  readonly platform = Platform.Twitter;

  readonly config: PlatformConfig = {
    enabled: process.env.STAGE === Stage.PRODUCTION,
    requiredEnvVars: [
      "TWITTER_APP_KEY",
      "TWITTER_APP_SECRET",
      "TWITTER_ACCESS_TOKEN",
      "TWITTER_ACCESS_SECRET",
    ],
  };

  async publish({ message, link }: SocialMessage): Promise<PublishResult> {
    if (!message) {
      return {
        success: false,
        error: "Tweet cannot be empty",
      };
    }

    if (!this.validateConfiguration()) {
      return {
        success: false,
        error: "Twitter configuration is incomplete",
      };
    }

    try {
      const twitterClient = this.createTwitterClient();
      const tweetText = this.formatTweet(message, link);

      const result = await twitterClient.v2.tweet({ text: tweetText });

      return {
        success: true,
        data: result.data,
        platformResponse: result,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Twitter API error: ${errorMessage}`,
      };
    }
  }

  async healthCheck(): Promise<PlatformHealth> {
    const lastChecked = new Date();

    if (!this.validateConfiguration()) {
      return {
        platform: this.platform,
        healthy: false,
        error: "Missing required Twitter API credentials",
        lastChecked,
      };
    }

    try {
      const twitterClient = this.createTwitterClient();

      // Test API connectivity by fetching user info
      await twitterClient.v2.me();

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

  private createTwitterClient(): TwitterApi {
    return new TwitterApi({
      appKey: process.env.TWITTER_APP_KEY as string,
      appSecret: process.env.TWITTER_APP_SECRET as string,
      accessToken: process.env.TWITTER_ACCESS_TOKEN as string,
      accessSecret: process.env.TWITTER_ACCESS_SECRET as string,
    });
  }

  private formatTweet(message: string, link: string): string {
    const fullText = `${message} ${link}`;

    if (fullText.length <= TWITTER_CHAR_LIMIT) {
      return fullText;
    }

    // Calculate available space for message: total limit - link length - space - ellipsis
    const availableSpace = TWITTER_CHAR_LIMIT - link.length - 4; // 4 chars for " ..."

    if (availableSpace > 0) {
      return `${message.substring(0, availableSpace)}... ${link}`;
    }

    // If link is too long, truncate the entire text
    return `${fullText.substring(0, TWITTER_CHAR_LIMIT - 3)}...`;
  }
}
