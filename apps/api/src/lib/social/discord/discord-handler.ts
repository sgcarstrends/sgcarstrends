import { Platform } from "@api/types/social-media";
import type {
  PlatformConfig,
  PlatformHandler,
  PlatformHealth,
  PublishResult,
  SocialMessage,
} from "../interfaces/platform-handler";

export class DiscordHandler implements PlatformHandler {
  readonly platform = Platform.Discord;

  readonly config: PlatformConfig = {
    enabled: true,
    requiredEnvVars: ["DISCORD_WEBHOOK_URL"],
  };

  async publish({ message, link }: SocialMessage): Promise<PublishResult> {
    if (!message) {
      return {
        success: false,
        error: "Discord message cannot be empty",
      };
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      return {
        success: false,
        error: "Discord webhook URL not configured",
      };
    }

    try {
      const response = await fetch(`${webhookUrl}?wait=true`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: `${message} ${link}` }),
      });

      if (!response.ok) {
        const text = await response.text();
        return {
          success: false,
          error: `Discord API error: ${response.status} - ${text}`,
          platformResponse: {
            status: response.status,
            message: text,
          },
        };
      }

      const data = await response.json();
      return {
        success: true,
        data,
        platformResponse: data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async healthCheck(): Promise<PlatformHealth> {
    const lastChecked = new Date();

    if (!this.validateConfiguration()) {
      return {
        platform: this.platform,
        healthy: false,
        error: "Missing required configuration",
        lastChecked,
      };
    }

    try {
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL as string;

      // Test webhook with a minimal request to check if it's accessible
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: "" }), // Empty content for health check
      });

      // Discord returns 400 for empty content, but webhook is accessible
      const isAccessible = response.status === 400 || response.ok;

      return {
        platform: this.platform,
        healthy: isAccessible,
        error: isAccessible
          ? undefined
          : `Webhook not accessible: ${response.status}`,
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
