import { getRelatedPosts } from "@web/lib/data/posts";
import Image from "next/image";
import Link from "next/link";
import readingTime from "reading-time";

interface RelatedPostsProps {
  currentPostId: string;
  limit?: number;
}

// Fallback hero images (same as blog post page)
const defaultHeroImages: Record<string, string> = {
  cars: "https://images.unsplash.com/photo-1519043916581-33ecfdba3b1c?w=1200&h=514&fit=crop",
  coe: "https://images.unsplash.com/photo-1519045550819-021aa92e9312?w=1200&h=514&fit=crop",
};

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
          const heroImage =
            post.heroImage || defaultHeroImages[post.dataType ?? "cars"];
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
              <article className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                {/* Background Image with hover zoom */}
                <Image
                  src={heroImage}
                  alt={`Cover image for ${post.title}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

                {/* Content - Bottom aligned */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  {/* Category Label */}
                  <span className="mb-2 font-bold text-[10px] text-white/70 uppercase tracking-[0.2em] drop-shadow-md">
                    {category}
                  </span>

                  {/* Title */}
                  <h3 className="mb-2 line-clamp-2 font-bold text-lg text-white leading-tight drop-shadow-lg">
                    {post.title}
                  </h3>

                  {/* Metadata with dot separator */}
                  <div className="flex items-center gap-2 text-white/70 text-xs drop-shadow-md">
                    <span>
                      {publishedDate.toLocaleDateString("en-SG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-white/50" />
                    <span>{Math.ceil(readTime)} min read</span>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
