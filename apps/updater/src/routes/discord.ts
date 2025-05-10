import { postToDiscord } from "@updater/lib/discord/post-to-discord";
import { Hono } from "hono";

const discord = new Hono();

/**
 * Endpoint to publish a message to Discord via webhook.
 */
discord.post("/post", async (c) => {
  try {
    const body = await c.req.json();

    if (!body.message) {
      return c.json({ success: false, error: "Message is required" }, 400);
    }

    const { message, link } = body;
    const result = await postToDiscord({ message, link });
    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("[Discord] Error posting:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

export { discord };
