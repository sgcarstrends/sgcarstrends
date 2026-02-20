import { getRelatedPosts } from "@web/lib/data/posts";
import Link from "next/link";
import readingTime from "reading-time";

interface RelatedPostsProps {
  currentPostId: string;
  limit?: number;
}

// Category label mapping
const categoryLabels: Record<string, string> = {
  cars: "Market Analysis",
  coe: "COE Bidding",
};

export async function RelatedPosts({
  currentPostId,
  limit = 3,
}: RelatedPostsProps) {
  const relatedPosts = await getRelatedPosts(currentPostId, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="border-foreground border-t-2 pt-8">
      {/* Section header - matches KeyHighlights style */}
      <h2 className="mb-6 font-bold text-foreground/60 text-xs uppercase tracking-[0.3em]">
        Related Posts
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => {
          const category =
            categoryLabels[post.dataType ?? "cars"] ?? "Insights";
          const publishedDate = post.publishedAt ?? post.createdAt;
          const readTime = readingTime(post.content).minutes;

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block h-full"
            >
              <article className="flex h-full flex-col gap-4 rounded-lg border border-default-200 p-4 transition-colors hover:border-default-400">
                {/* Category Label */}
                <span className="font-bold text-[10px] text-default-500 uppercase tracking-[0.2em]">
                  {category}
                </span>

                {/* Title */}
                <h3 className="line-clamp-2 font-bold text-lg leading-tight">
                  {post.title}
                </h3>

                {/* Metadata */}
                <div className="flex items-center gap-2 text-default-400 text-xs">
                  <span>
                    {publishedDate.toLocaleDateString("en-SG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="size-1 rounded-full bg-default-300" />
                  <span>{Math.ceil(readTime)} min read</span>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
