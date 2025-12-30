import { Card, CardBody, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export function ChartSkeleton() {
  return (
    <Card className="p-3">
      <CardHeader>
        <Skeleton className="h-6 w-48 rounded-lg" />
      </CardHeader>
      <CardBody>
        <Skeleton className="h-64 w-full rounded-lg" />
      </CardBody>
    </Card>
  );
}
