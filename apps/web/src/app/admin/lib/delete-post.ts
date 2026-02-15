import { db, eq, posts } from "@sgcarstrends/database";
import { getPostPublishRevalidationTags } from "@web/lib/cache-tags/posts";
import { revalidateTag } from "next/cache";
import { cleanupPostTags } from "./post-tags";

export const deletePost = async (id: string) => {
  const existing = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });

  if (!existing) {
    throw new Error("Post not found");
  }

  await db.delete(posts).where(eq(posts.id, id));

  // Clean up Redis tag mappings
  if (existing.tags && existing.tags.length > 0) {
    await cleanupPostTags(id, existing.tags);
  }

  // Revalidate cache
  for (const tag of getPostPublishRevalidationTags(existing.slug)) {
    revalidateTag(tag, "max");
  }
};
