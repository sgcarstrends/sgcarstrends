import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export function MetricCardSkeleton() {
  return (
    <Card className="p-3">
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
}
