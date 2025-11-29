import Typography from "@web/components/typography";
import { getRelatedPosts } from "@web/lib/data/posts";
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
      <Typography.H3>Related Posts</Typography.H3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block rounded-lg border border-border p-4 transition-colors hover:border-primary/50"
          >
            <Typography.H4 className="line-clamp-2 transition-colors group-hover:text-primary">
              {post.title}
            </Typography.H4>
            <Typography.TextSm>
              {(post.metadata as any)?.excerpt ?? ""}
            </Typography.TextSm>
            <Typography.Caption>
              {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString(
                "en-SG",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </Typography.Caption>
          </Link>
        ))}
      </div>
    </div>
  );
};
