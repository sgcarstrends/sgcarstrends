import { postToTelegram } from "@api/updater/lib/telegram/post-to-telegram";
import { Hono } from "hono";

const telegram = new Hono();

telegram.post("/post", async (c) => {
  try {
    const body = await c.req.json();

    if (!body.message) {
      return c.json({ success: false, error: "Message is required" }, 400);
    }

    const { message, link } = body;
    const result = await postToTelegram({ message, link });
    return c.json({ success: true, data: result });
  } catch (error) {
    console.error("Error posting to Telegram", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

export { telegram };
