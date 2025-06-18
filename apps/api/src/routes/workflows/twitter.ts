import { postToTwitter } from "@api/lib/social/twitter/post-to-twitter";
import { Hono } from "hono";

const twitter = new Hono();

/**
 * Endpoint to publish a tweet.
 */
twitter.post("/post", async (c) => {
  try {
    const body = await c.req.json();

    if (!body.message) {
      return c.json({ success: false, error: "Message is required" }, 400);
    }

    const { message, link } = body;
    const result = await postToTwitter({ message, link });
    return c.json({ success: true, data: result.data });
  } catch (error) {
    console.error("[Twitter] Error posting:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

export { twitter };
