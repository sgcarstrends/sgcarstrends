import type { Platform } from "@web/types/social-media";
import { createSocialShareURL } from "@web/utils/utm";
import type {
  PlatformHandler,
  PlatformHealth,
  PublishResult,
  SocialMessage,
} from "./interfaces/platform-handler";

export interface PublishResults {
  success: boolean;
  results: Map<Platform, PublishResult>;
  successCount: number;
  errorCount: number;
}

export class SocialMediaManager {
  private platforms: Map<Platform, PlatformHandler> = new Map();

  constructor(platformHandlers: PlatformHandler[]) {
    for (const handler of platformHandlers) {
      this.platforms.set(handler.platform, handler);
    }
  }

  /**
   * Publish a message to all enabled platforms
   */
  async publishToAll(message: SocialMessage): Promise<PublishResults> {
    const enabledPlatforms = this.getEnabledPlatforms();
    const results = new Map<Platform, PublishResult>();

    console.log(
      `Publishing to ${enabledPlatforms.length} enabled platforms:`,
      enabledPlatforms.map(({ platform }) => platform),
    );

    const publishPromises = enabledPlatforms.map(async (handler) => {
      try {
        // Add platform-specific UTM tracking to the link
        const result = await handler.publish({
          ...message,
          link: createSocialShareURL(message.link, handler.platform),
        });
        results.set(handler.platform, result);

        if (result.success) {
          console.log(`✅ Successfully published to ${handler.platform}`);
        } else {
          console.error(
            `❌ Failed to publish to ${handler.platform}:`,
            result.error,
          );
        }

        return result;
      } catch (error) {
        const failureResult: PublishResult = {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
        results.set(handler.platform, failureResult);
        console.error(`❌ Error publishing to ${handler.platform}:`, error);
        return failureResult;
      }
    });

    await Promise.allSettled(publishPromises);

    const successCount = Array.from(results.values()).filter(
      (r) => r.success,
    ).length;
    const errorCount = results.size - successCount;

    const publishResults: PublishResults = {
      success: errorCount === 0,
      results,
      successCount,
      errorCount,
    };

    console.log(
      `📊 Publishing complete: ${successCount} successful, ${errorCount} failed`,
    );

    return publishResults;
  }

  /**
   * Publish a message to a specific platform
   */
  async publishToPlatform(
    platform: Platform,
    message: SocialMessage,
  ): Promise<PublishResult> {
    const handler = this.platforms.get(platform);

    if (!handler) {
      return {
        success: false,
        error: `Platform ${platform} not found`,
      };
    }

    if (!handler.config.enabled) {
      return {
        success: false,
        error: `Platform ${platform} is disabled`,
      };
    }

    if (!handler.validateConfiguration()) {
      return {
        success: false,
        error: `Platform ${platform} configuration is invalid`,
      };
    }

    try {
      console.log(`📤 Publishing to ${platform}`);
      const result = await handler.publish({
        ...message,
        link: createSocialShareURL(message.link, platform),
      });

      if (result.success) {
        console.log(`✅ Successfully published to ${platform}`);
      } else {
        console.error(`❌ Failed to publish to ${platform}:`, result.error);
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`❌ Error publishing to ${platform}:`, error);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get all enabled and properly configured platforms
   */
  getEnabledPlatforms(): PlatformHandler[] {
    return Array.from(this.platforms.values()).filter(
      (handler) => handler.config.enabled && handler.validateConfiguration(),
    );
  }

  /**
   * Get all available platforms (enabled and disabled)
   */
  getAllPlatforms(): PlatformHandler[] {
    return Array.from(this.platforms.values());
  }

  /**
   * Check health of all platforms
   */
  async healthCheck(): Promise<PlatformHealth[]> {
    const healthPromises = Array.from(this.platforms.values()).map(
      async (handler) => {
        try {
          return await handler.healthCheck();
        } catch (error) {
          return {
            platform: handler.platform,
            healthy: false,
            error: error instanceof Error ? error.message : String(error),
            lastChecked: new Date(),
          };
        }
      },
    );

    return Promise.all(healthPromises);
  }

  /**
   * Get a specific platform handler
   */
  getPlatformHandler(platform: Platform): PlatformHandler | undefined {
    return this.platforms.get(platform);
  }

  /**
   * Check if a platform is available and enabled
   */
  isPlatformAvailable(platform: Platform): boolean {
    const handler = this.platforms.get(platform);
    return (
      (handler?.config.enabled && handler.validateConfiguration()) || false
    );
  }
}
