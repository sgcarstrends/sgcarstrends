import { postToLinkedin } from "@api/lib/social/linkedin/post-to-linkedin";
import { Hono } from "hono";

const linkedin = new Hono();

linkedin.post("/post", async (c) => {
  try {
    const body = await c.req.json();
    if (!body) {
      return c.json({ success: false, error: "Message is required" }, 400);
    }

    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN as string;

    const { message, link } = body;
    const createdEntityId = await postToLinkedin({ message, link });

    return c.json({ success: true, data: { id: createdEntityId } });
  } catch (error) {
    console.error("[LinkedIn] Error posting:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

export { linkedin };
