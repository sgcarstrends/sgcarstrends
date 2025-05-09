import { postToTwitter } from "@updater/lib/twitter/post-to-twitter";
import { Hono } from "hono";

const twitter = new Hono();

/**
 * Endpoint to publish a tweet.
 */
twitter.post("/post", async (c) => {
  try {
    const body = await c.req.json();

    if (!body.message) {
      return c.json({ error: "Message is required" }, 400);
    }

    const result = await postToTwitter(body.message);
    return c.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Error posting tweet:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

export { twitter };
