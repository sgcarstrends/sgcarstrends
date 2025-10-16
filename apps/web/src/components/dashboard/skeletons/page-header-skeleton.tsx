import { Skeleton } from "@heroui/skeleton";

export const PageHeaderSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
      <Skeleton className="h-5 w-32 rounded-lg" />
    </div>
  );
};
