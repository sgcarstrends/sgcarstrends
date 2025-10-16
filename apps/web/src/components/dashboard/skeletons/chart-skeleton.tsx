import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

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
