import { ViewCounter } from "@web/app/(main)/blog/components/view-counter";
import { ShareButtons } from "@web/components/share-buttons";
import { SITE_URL } from "@web/config";
import Image from "next/image";
import { Suspense } from "react";

interface BlogHeroProps {
  title: string;
  slug: string;
  heroImage: string;
  publishedAt: Date;
  readingTimeText: string;
  tags?: string[];
  postId: string;
  initialViewCount: number;
}

export function BlogHero({
  title,
  slug,
  heroImage,
  publishedAt,
  readingTimeText,
  tags = [],
  postId,
  initialViewCount,
}: BlogHeroProps) {
  const categoryLabel = tags.length > 0 ? tags[0] : "Market Analysis";
  const shareUrl = `${SITE_URL}/blog/${slug}`;

  return (
    <div className="relative mb-12 aspect-[4/3] w-full overflow-hidden md:aspect-[21/9]">
      <Image
        src={heroImage}
        alt={title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
        <span className="mb-3 font-bold text-white/70 text-xs uppercase tracking-[0.3em] drop-shadow-md">
          {categoryLabel}
        </span>
        <h1 className="mb-3 max-w-4xl font-black text-2xl text-white leading-tight tracking-tight drop-shadow-lg sm:text-4xl md:text-6xl md:leading-[0.95]">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 font-medium text-white/70 text-xs uppercase tracking-wider drop-shadow-md sm:gap-4 sm:text-sm">
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
          <span className="size-2 rounded-full bg-white/50" />
          <ShareButtons
            url={shareUrl}
            title={title}
            className="text-white/80 hover:bg-white/10 hover:text-white"
          />
        </div>
      </div>
    </div>
  );
}
