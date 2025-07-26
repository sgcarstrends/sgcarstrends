import type { PostToTelegramParam } from "@api/types/social-media";
import { Resource } from "sst";

const botToken = Resource.TELEGRAM_BOT_TOKEN.value;
const channelId = Resource.TELEGRAM_CHANNEL_ID.value;

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

/**
 * Post a message to a Telegram channel via bot.
 */
export const postToTelegram = async ({
  message,
  link,
  parseMode = "HTML",
}: PostToTelegramParam) => {
  if (!message) {
    throw new Error("Telegram message cannot be empty.");
  }

  if (!botToken || !channelId) {
    throw new Error("Telegram bot token and chat ID are required.");
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: channelId,
        text: `${message}\n\n🔗 <a href="${link}">View Full Details</a>`,
        parse_mode: parseMode,
      }),
    });

    if (!res.ok) {
      console.error("Telegram API error:", res);
      return { success: false, error: "Failed to send Telegram message." };
    }

    const data = (await res.json()) as TelegramSendMessageResponse;
    console.log("Telegram message sent:", data);

    // Add fire reaction to the message
    if (data.ok && data.result?.message_id) {
      try {
        const reactionUrl = `https://api.telegram.org/bot${botToken}/setMessageReaction`;
        await fetch(reactionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: channelId,
            message_id: data.result.message_id,
            reaction: [{ type: "emoji", emoji: "🔥" }],
          }),
        });
      } catch (reactionError) {
        console.warn("Failed to add reaction:", reactionError);
        // Don't throw - reaction failure shouldn't fail the entire post
      }
    }

    return data;
  } catch (error) {
    console.error("Error posting to Telegram:", error);
    throw new Error(error.message ?? "Failed to post to Telegram.");
  }
};
