import { Platform } from "@web/types/social-media";
import type {
  PlatformConfig,
  PlatformHandler,
  PlatformHealth,
  PublishResult,
  SocialMessage,
} from "../interfaces/platform-handler";

type TelegramSendMessageResponse = {
  ok: boolean;
  result: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username: string;
    };
    chat: {
      id: number;
      title: string;
      type: string;
    };
    date: number;
    text: string;
  };
};

export class TelegramHandler implements PlatformHandler {
  readonly platform = Platform.Telegram;

  readonly config: PlatformConfig = {
    enabled: true,
    requiredEnvVars: ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHANNEL_ID"],
  };

  async publish({ message, link }: SocialMessage): Promise<PublishResult> {
    if (!message) {
      return {
        success: false,
        error: "Telegram message cannot be empty",
      };
    }

    if (!this.validateConfiguration()) {
      return {
        success: false,
        error: "Telegram configuration is incomplete",
      };
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN as string;
    const channelId = process.env.TELEGRAM_CHANNEL_ID as string;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: channelId,
          text: `${message} ${link}`,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          error: `Telegram API error: ${res.status} - ${errorText}`,
        };
      }

      const data = (await res.json()) as TelegramSendMessageResponse;

      // Add fire reaction to the message
      if (data.ok && data.result?.message_id) {
        await this.addFireReaction(data.result.message_id);
      }

      return {
        success: true,
        data: data.result,
        platformResponse: data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to post to Telegram: ${errorMessage}`,
      };
    }
  }

  async healthCheck(): Promise<PlatformHealth> {
    const lastChecked = new Date();

    if (!this.validateConfiguration()) {
      return {
        platform: this.platform,
        healthy: false,
        error: "Missing required Telegram configuration",
        lastChecked,
      };
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN as string;

    try {
      // Test bot API connectivity by getting bot info
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/getMe`,
      );

      if (!response.ok) {
        return {
          platform: this.platform,
          healthy: false,
          error: `Telegram API error: ${response.status}`,
          lastChecked,
        };
      }

      const data = (await response.json()) as TelegramSendMessageResponse;

      return {
        platform: this.platform,
        healthy: data.ok,
        error: data.ok ? undefined : "Bot API returned error",
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

  private async addFireReaction(messageId: number): Promise<void> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN as string;
    const channelId = process.env.TELEGRAM_CHANNEL_ID as string;

    try {
      const reactionUrl = `https://api.telegram.org/bot${botToken}/setMessageReaction`;
      await fetch(reactionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: channelId,
          message_id: messageId,
          reaction: [{ type: "emoji", emoji: "🔥" }],
        }),
      });
    } catch (reactionError) {
      console.warn("Failed to add Telegram reaction:", reactionError);
      // Don't throw - reaction failure shouldn't fail the entire post
    }
  }
}
