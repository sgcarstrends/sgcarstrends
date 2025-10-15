import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export const MetricCardSkeleton = () => {
  return (
    <Card className="p-4">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 rounded-lg" />
      </CardHeader>
      <CardBody>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </CardBody>
      <CardFooter>
        <Skeleton className="h-5 w-24 rounded-lg" />
      </CardFooter>
    </Card>
  );
};

export const ChartSkeleton = () => {
  return (
    <Card className="p-4">
      <CardHeader>
        <Skeleton className="h-6 w-48 rounded-lg" />
      </CardHeader>
      <CardBody>
        <Skeleton className="h-64 w-full rounded-lg" />
      </CardBody>
    </Card>
  );
};

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
