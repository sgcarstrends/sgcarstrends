import { DiscordHandler } from "@api/lib/social/discord/discord-handler";
import { LinkedInHandler } from "@api/lib/social/linkedin/linkedin-handler";
import { SocialMediaManager } from "@api/lib/social/social-media-manager";
import { TelegramHandler } from "@api/lib/social/telegram/telegram-handler";
import { TwitterHandler } from "@api/lib/social/twitter/twitter-handler";
import { Platform } from "@api/types/social-media";
import { Hono } from "hono";

const social = new Hono();

// Initialize the social media manager with all platform handlers
const socialMediaManager = new SocialMediaManager([
  new DiscordHandler(),
  new LinkedInHandler(),
  new TwitterHandler(),
  new TelegramHandler(),
]);

/**
 * Unified endpoint to publish a message to all enabled platforms or a specific platform.
 *
 * POST /workflows/social/post - Publish to all enabled platforms
 * POST /workflows/social/post?platform=Discord - Publish to specific platform
 */
social.post("/post", async (c) => {
  try {
    const body = await c.req.json();
    const platformParam = c.req.query("platform") as Platform | undefined;

    if (!body.message) {
      return c.json(
        {
          success: false,
          error: "Message is required",
        },
        400,
      );
    }

    const { message, link } = body;

    // Publish to specific platform if specified, otherwise publish to all
    if (platformParam) {
      // Validate platform parameter
      const validPlatforms = Object.values(Platform);
      if (!validPlatforms.includes(platformParam)) {
        return c.json(
          {
            success: false,
            error: `Invalid platform. Must be one of: ${validPlatforms.join(", ")}`,
          },
          400,
        );
      }

      const result = await socialMediaManager.publishToPlatform(platformParam, {
        message,
        link,
      });

      return c.json({
        success: result.success,
        data: result.data,
        error: result.error,
        platform: platformParam,
      });
    } else {
      // Publish to all enabled platforms
      const results = await socialMediaManager.publishToAll({ message, link });

      return c.json({
        success: results.success,
        data: {
          successCount: results.successCount,
          errorCount: results.errorCount,
          platforms: Object.fromEntries(
            Array.from(results.results.entries()).map(([platform, result]) => [
              platform,
              {
                success: result.success,
                error: result.error,
                data: result.data,
              },
            ]),
          ),
        },
      });
    }
  } catch (error) {
    console.error("[Social] Error posting:", error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

/**
 * Health check endpoint for all social media platforms
 * GET /workflows/social/health
 */
social.get("/health", async (c) => {
  try {
    const healthResults = await socialMediaManager.healthCheck();

    const overallHealthy = healthResults.every((result) => result.healthy);

    return c.json({
      success: true,
      healthy: overallHealthy,
      platforms: healthResults.map((health) => ({
        platform: health.platform,
        healthy: health.healthy,
        error: health.error,
        lastChecked: health.lastChecked,
      })),
    });
  } catch (error) {
    console.error("[Social] Error checking health:", error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

/**
 * Get enabled platforms
 * GET /workflows/social/platforms
 */
social.get("/platforms", async (c) => {
  try {
    const enabledPlatforms = socialMediaManager.getEnabledPlatforms();
    const allPlatforms = socialMediaManager.getAllPlatforms();

    return c.json({
      success: true,
      data: {
        enabled: enabledPlatforms.map((handler) => ({
          platform: handler.platform,
          configured: handler.validateConfiguration(),
        })),
        all: allPlatforms.map((handler) => ({
          platform: handler.platform,
          enabled: handler.config.enabled,
          configured: handler.validateConfiguration(),
        })),
      },
    });
  } catch (error) {
    console.error("[Social] Error getting platforms:", error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});

export { social };
