import { AnimatedNumber } from "@web/components/animated-number";
import { MetricsComparison } from "@web/components/metrics-comparison";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";

interface Props {
  title: string;
  value: number;
  current: number;
  previousMonth: number;
}

export const MetricCard = ({ title, value, current, previousMonth }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="font-bold text-2xl text-primary">
        <AnimatedNumber value={value} />
      </CardContent>
      <CardFooter>
        <MetricsComparison current={current} previousMonth={previousMonth} />
      </CardFooter>
    </Card>
  );
};
