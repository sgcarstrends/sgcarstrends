import type { PostToDiscordParam } from "@api/types/social-media";

/**
 * Post a message to a Discord channel via webhook.
 */
export const postToDiscord = async ({ message, link }: PostToDiscordParam) => {
  if (!message) {
    throw new Error("Discord message cannot be empty.");
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("Discord webhook URL is required.");
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
        error: true,
        status: response.status,
        message: text,
      };
    }

    const data = await response.json();
    console.log("Discord message sent:", data);
    return data;
  } catch (error) {
    console.error("Error posting to Discord:", error);
    throw new Error(error.message || "Failed to post to Discord.");
  }
};
