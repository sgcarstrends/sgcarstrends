import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { AnimatedNumber } from "@web/components/animated-number";
import { MetricsComparison } from "@web/components/metrics-comparison";
import Typography from "@web/components/typography";

interface MetricCardProps {
  title: string;
  value: number;
  current: number;
  previousMonth: number;
}

export function MetricCard({
  title,
  value,
  current,
  previousMonth,
}: MetricCardProps) {
  return (
    <Card className="p-3">
      <CardHeader>
        <Typography.H4>{title}</Typography.H4>
      </CardHeader>
      <CardBody>
        <div className="font-semibold text-4xl text-primary">
          <AnimatedNumber value={value} />
        </div>
      </CardBody>
      <CardFooter>
        <MetricsComparison current={current} previousMonth={previousMonth} />
      </CardFooter>
    </Card>
  );
}
