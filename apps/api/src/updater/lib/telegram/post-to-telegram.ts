import type { PostToTelegramParam } from "@api/updater/types/social-media";
import { Resource } from "sst";

const botToken = Resource.TELEGRAM_BOT_TOKEN.value;
const channelId = Resource.TELEGRAM_CHANNEL_ID.value;

/**
 * Post a message to a Telegram channel via bot.
 */
export const postToTelegram = async ({
  message,
  link,
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
      body: JSON.stringify({ chat_id: channelId, text: `${message} ${link}` }),
    });

    if (!res.ok) {
      console.error("Telegram API error:", res);
      return { success: false, error: "Failed to send Telegram message." };
    }

    const data = await res.json();
    console.log("Telegram message sent:", data);
    return data;
  } catch (error) {
    console.error("Error posting to Telegram:", error);
    throw new Error(error.message ?? "Failed to post to Telegram.");
  }
};
