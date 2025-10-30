import { getRelatedPosts } from "@web/app/blog/_actions";
import Link from "next/link";

interface RelatedPostsProps {
  currentPostId: string;
  limit?: number;
}

export const RelatedPosts = async ({
  currentPostId,
  limit = 3,
}: RelatedPostsProps) => {
  const relatedPosts = await getRelatedPosts(currentPostId, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-8">
      <h3 className="mb-4 font-semibold text-xl">Related Posts</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block rounded-lg border border-border p-4 transition-colors hover:border-primary/50"
          >
            <h4 className="line-clamp-2 font-medium transition-colors group-hover:text-primary">
              {post.title}
            </h4>
            <p className="mt-2 line-clamp-2 text-muted-foreground text-sm">
              {(post.metadata as any)?.excerpt ?? ""}
            </p>
            <time className="mt-2 block text-muted-foreground text-xs">
              {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString(
                "en-SG",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </time>
          </Link>
        ))}
      </div>
    </div>
  );
};
