import { Skeleton as HeroUISkeleton } from "@heroui/skeleton";
import { cn } from "@heroui/theme";

interface SkeletonProps {
  className?: string;
}

// Base skeleton primitives
export const SkeletonText = ({ className }: SkeletonProps) => (
  <HeroUISkeleton className={cn("h-4 w-full rounded-lg", className)} />
);

export const SkeletonHeading = ({ className }: SkeletonProps) => (
  <HeroUISkeleton className={cn("h-8 w-48 rounded-lg", className)} />
);

export const SkeletonCard = ({ className }: SkeletonProps) => (
  <HeroUISkeleton className={cn("h-32 w-full rounded-lg", className)} />
);

export const SkeletonChart = ({ className }: SkeletonProps) => (
  <HeroUISkeleton className={cn("h-80 w-full rounded-lg", className)} />
);

// Composed section skeletons for Suspense fallbacks
interface SectionSkeletonProps {
  title?: boolean;
  children: React.ReactNode;
}

export const SectionSkeleton = ({
  title = true,
  children,
}: SectionSkeletonProps) => (
  <section className="flex flex-col gap-4">
    {title && <SkeletonHeading />}
    {children}
  </section>
);

// Grid skeleton for card layouts
interface GridSkeletonProps {
  count: number;
  columns?: string;
  className?: string;
}

export const GridSkeleton = ({
  count,
  columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  className,
}: GridSkeletonProps) => (
  <div className={cn("grid gap-4", columns, className)}>
    {Array.from({ length: count }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static placeholders
      <SkeletonCard key={i} />
    ))}
  </div>
);

// List skeleton for post/item lists
interface ListSkeletonProps {
  count: number;
  itemHeight?: string;
}

export const ListSkeleton = ({
  count,
  itemHeight = "h-20",
}: ListSkeletonProps) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: count }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static placeholders
      <HeroUISkeleton key={i} className={cn("w-full rounded-lg", itemHeight)} />
    ))}
  </div>
);
