import { ViewCounter } from "@web/app/(main)/blog/components/view-counter";
import { Suspense } from "react";

interface BlogHeroProps {
  title: string;
  slug: string;
  publishedAt: Date;
  readingTimeText: string;
  tags?: string[];
  postId: string;
  initialViewCount: number;
}

export function BlogHero({
  title,
  publishedAt,
  readingTimeText,
  tags = [],
  postId,
  initialViewCount,
}: BlogHeroProps) {
  const categoryLabel = tags.length > 0 ? tags[0] : "Market Analysis";

  return (
    <div className="relative mb-12 w-full overflow-hidden bg-gradient-to-br from-[#191970] to-[#2E4A8E] py-16 md:py-24">
      <div className="container mx-auto flex flex-col justify-end px-6 md:px-12">
        <span className="mb-3 font-bold text-white/70 text-xs uppercase tracking-[0.3em]">
          {categoryLabel}
        </span>
        <h1 className="mb-3 max-w-4xl font-black text-2xl text-white leading-tight tracking-tight sm:text-4xl md:text-6xl md:leading-[0.95]">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 font-medium text-white/70 text-xs uppercase tracking-wider sm:gap-4 sm:text-sm">
          <span>
            {publishedAt.toLocaleDateString("en-SG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="h-1 w-1 rounded-full bg-white/50" />
          <span>{readingTimeText}</span>
          <span className="h-1 w-1 rounded-full bg-white/50" />
          <Suspense fallback={null}>
            <ViewCounter
              postId={postId}
              initialCount={initialViewCount}
              className="text-inherit"
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
