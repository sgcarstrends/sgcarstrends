import { Chip } from "@heroui/chip";
import { ViewCounter } from "@web/app/blog/_components/view-counter";
import { Suspense } from "react";

interface ArticleHeaderProps {
  title: string;
  publishedAt: Date;
  readingTimeText: string;
  tags?: string[];
  postId: string;
  initialViewCount: number;
}

export const ArticleHeader = ({
  title,
  publishedAt,
  readingTimeText,
  tags = [],
  postId,
  initialViewCount,
}: ArticleHeaderProps) => {
  const displayTags = tags.length > 0 ? tags.slice(0, 2) : ["Market Update"];

  return (
    <header className="border-default-200 border-b py-8">
      <div className="mx-auto max-w-3xl px-6 text-center">
        {/* Dynamic Tags - Centered with Chips */}
        <div className="mb-4 flex items-center justify-center gap-2">
          {displayTags.map((tag) => (
            <Chip
              key={tag}
              size="sm"
              variant="flat"
              className="bg-default-100 text-default-600 text-xs"
            >
              {tag}
            </Chip>
          ))}
        </div>

        {/* Gradient Title */}
        <h1 className="mx-auto mb-4 max-w-4xl bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text font-semibold text-3xl text-transparent leading-tight md:text-5xl">
          {title}
        </h1>

        {/* Metadata: Date • Reading time • Views - Centered */}
        <div className="flex items-center justify-center gap-3 text-default-500 text-sm">
          <span>
            {publishedAt.toLocaleDateString("en-SG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="text-default-300">•</span>
          <span>{readingTimeText}</span>
          <span className="text-default-300">•</span>
          <Suspense fallback={null}>
            <ViewCounter postId={postId} initialCount={initialViewCount} />
          </Suspense>
        </div>
      </div>
    </header>
  );
};
