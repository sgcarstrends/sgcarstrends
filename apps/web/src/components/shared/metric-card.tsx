import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { AnimatedNumber } from "@web/components/animated-number";
import { MetricsComparison } from "@web/components/metrics-comparison";

interface Props {
  title: string;
  value: number;
  current: number;
  previousMonth: number;
}

export const MetricCard = ({ title, value, current, previousMonth }: Props) => {
  return (
    <Card className="p-4">
      <CardHeader>
        <div className="font-bold text-lg">{title}</div>
      </CardHeader>
      <CardBody>
        <div className="font-bold text-4xl text-primary">
          <AnimatedNumber value={value} />
        </div>
      </CardBody>
      <CardFooter>
        <MetricsComparison current={current} previousMonth={previousMonth} />
      </CardFooter>
    </Card>
  );
};
