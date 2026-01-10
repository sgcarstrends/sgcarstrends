import type { WorkflowContext } from "@upstash/workflow";
import { regeneratePost } from "@web/lib/workflows/regenerate-post";
import { revalidateCache } from "@web/lib/workflows/steps";
import type { RegenerationPayload } from "@web/lib/workflows/types";

export async function regenerationWorkflow(context: WorkflowContext) {
  const { month, dataType } = context.requestPayload as RegenerationPayload;
  const post = await regeneratePost(context, { month, dataType });

  await revalidateCache(context, ["posts:list", "posts:recent"]);

  return {
    message: `[${dataType.toUpperCase()}] Post regenerated successfully`,
    postId: post.postId,
    title: post.title,
    slug: post.slug,
  };
}
