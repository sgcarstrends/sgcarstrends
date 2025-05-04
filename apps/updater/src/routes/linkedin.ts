import { postToLinkedin } from "@updater/lib/linkedin/post-to-linkedin";
import { resharePost } from "@updater/lib/linkedin/reshare-post";
import { Hono } from "hono";
import { Resource } from "sst";

const linkedin = new Hono();

linkedin.post("/post", async (c) => {
  const accessToken = Resource.LINKEDIN_ACCESS_TOKEN.value;
  if (!accessToken) {
    return c.text("Access token and message are required", 400);
  }

  const createdEntityId = await postToLinkedin();
  if (createdEntityId) {
    await resharePost(createdEntityId);
  }

  return c.json({ createdEntityId });
});

export { linkedin };
