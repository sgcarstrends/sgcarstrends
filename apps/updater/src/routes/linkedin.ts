import { postToLinkedin } from "@updater/lib/linkedin/post-to-linkedin";
import { Hono } from "hono";
import { Resource } from "sst";

const linkedin = new Hono();

linkedin.post("/post", async (c) => {
  try {
    const body = await c.req.json();
    if (!body) {
      return c.json({ success: false, error: "Message is required" }, 400);
    }

    const accessToken = Resource.LINKEDIN_ACCESS_TOKEN.value;
    if (!accessToken) {
      return c.json(
        { success: false, error: "Access token and message are required" },
        401,
      );
    }

    const { message, link } = body;
    const createdEntityId = await postToLinkedin({ message, link });

    return c.json({ success: true, data: { id: createdEntityId } });
  } catch (error) {
    console.error("[LinkedIn] Error posting:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

export { linkedin };
