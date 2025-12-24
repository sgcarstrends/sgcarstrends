import { options } from "@api/lib/workflows/options";
import { regeneratePost } from "@api/lib/workflows/regenerate-post";
import { revalidateCache } from "@api/lib/workflows/steps";
import { createWorkflow } from "@upstash/workflow/hono";

interface RegenerationPayload {
  month: string;
  dataType: "cars" | "coe";
}

export const regenerationWorkflow = createWorkflow<RegenerationPayload>(
  async (context, { month, dataType }) => {
    const post = await regeneratePost(context, { month, dataType });

    await revalidateCache(context, ["posts:list", "posts:recent"]);

    return {
      message: `[${dataType.toUpperCase()}] Post regenerated successfully`,
      postId: post.postId,
      title: post.title,
      slug: post.slug,
    };
  },
  { ...options },
);
