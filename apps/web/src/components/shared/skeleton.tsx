import { Skeleton as HeroUISkeleton } from "@heroui/skeleton";
import { cn } from "@heroui/theme";

interface SkeletonProps {
  className?: string;
}

// Base skeleton primitives
export function SkeletonText({ className }: SkeletonProps) {
  return <HeroUISkeleton className={cn("h-4 w-full rounded-lg", className)} />;
}

export function SkeletonHeading({ className }: SkeletonProps) {
  return <HeroUISkeleton className={cn("h-8 w-48 rounded-lg", className)} />;
}

export function SkeletonCard({ className }: SkeletonProps) {
  return <HeroUISkeleton className={cn("h-32 w-full rounded-lg", className)} />;
}

export function SkeletonChart({ className }: SkeletonProps) {
  return <HeroUISkeleton className={cn("h-80 w-full rounded-lg", className)} />;
}

// Composed section skeletons for Suspense fallbacks
interface SectionSkeletonProps {
  title?: boolean;
  children: React.ReactNode;
}

export function SectionSkeleton({
  title = true,
  children,
}: SectionSkeletonProps) {
  return (
    <section className="flex flex-col gap-4">
      {title && <SkeletonHeading />}
      {children}
    </section>
  );
}

// Grid skeleton for card layouts
interface GridSkeletonProps {
  count: number;
  columns?: string;
  className?: string;
}

export function GridSkeleton({
  count,
  columns = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  className,
}: GridSkeletonProps) {
  return (
    <div className={cn("grid gap-4", columns, className)}>
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static placeholders
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// List skeleton for post/item lists
interface ListSkeletonProps {
  count: number;
  itemHeight?: string;
}

export function ListSkeleton({
  count,
  itemHeight = "h-20",
}: ListSkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <HeroUISkeleton
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static placeholders
          key={i}
          className={cn("w-full rounded-lg", itemHeight)}
        />
      ))}
    </div>
  );
}
