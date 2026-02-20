// TODO: Delete this file after backfilling is complete
import { db, eq, isNull, posts } from "@sgcarstrends/database";
import { generatePostEmbedding } from "./embedding";

async function backfillEmbeddings() {
  const postsWithoutEmbeddings = await db
    .select({
      id: posts.id,
      title: posts.title,
      excerpt: posts.excerpt,
      content: posts.content,
    })
    .from(posts)
    .where(isNull(posts.embedding));

  console.log(`Found ${postsWithoutEmbeddings.length} posts to backfill`);

  let success = 0;
  let failed = 0;

  for (const post of postsWithoutEmbeddings) {
    try {
      const embedding = await generatePostEmbedding(post);
      await db.update(posts).set({ embedding }).where(eq(posts.id, post.id));
      success++;
      console.log(
        `[${success}/${postsWithoutEmbeddings.length}] ${post.title}`,
      );
    } catch (error) {
      failed++;
      console.error(
        `Failed: "${post.title}":`,
        error instanceof Error ? error.message : String(error),
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log(`Backfill complete: ${success} success, ${failed} failed`);
}

backfillEmbeddings().catch(console.error);
