import { Skeleton } from "@heroui/skeleton";
import {
  ChartSkeleton,
  MetricCardSkeleton,
  PageHeaderSkeleton,
} from "@web/components/skeletons";

const DashboardLoading = () => {
  return (
    <div className="flex flex-col gap-4">
      <PageHeaderSkeleton />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>

      <div className="mb-4">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      <ChartSkeleton />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
};

export default DashboardLoading;
