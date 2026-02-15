import { db, posts } from "@sgcarstrends/database";
import { slugify } from "@sgcarstrends/utils";
import { getPostPublishRevalidationTags } from "@web/lib/cache-tags/posts";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { syncPostTags } from "./post-tags";

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  heroImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  highlights: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        detail: z.string(),
      }),
    )
    .optional(),
  month: z.string().optional(),
  dataType: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const createPost = async (input: CreatePostInput) => {
  const slug = slugify(input.title);
  const publishedAt = input.status === "published" ? new Date() : undefined;

  const values = {
    title: input.title,
    slug,
    content: input.content,
    excerpt: input.excerpt,
    heroImage: input.heroImage,
    tags: input.tags,
    highlights: input.highlights,
    status: input.status,
    month: input.month,
    dataType: input.dataType,
    publishedAt,
  };

  const hasConflictTarget = input.month && input.dataType;

  const [post] = hasConflictTarget
    ? await db
        .insert(posts)
        .values(values)
        .onConflictDoUpdate({
          target: [posts.month, posts.dataType],
          set: {
            title: input.title,
            slug,
            content: input.content,
            excerpt: input.excerpt,
            heroImage: input.heroImage,
            tags: input.tags,
            highlights: input.highlights,
            status: input.status,
            modifiedAt: new Date(),
            publishedAt,
          },
        })
        .returning()
    : await db.insert(posts).values(values).returning();

  // Sync tags to Redis for related posts functionality
  if (input.tags && input.tags.length > 0) {
    await syncPostTags(post.id, input.tags);
  }

  // Revalidate cache directly (same Next.js process)
  for (const tag of getPostPublishRevalidationTags(slug)) {
    revalidateTag(tag, "max");
  }

  return post;
};
