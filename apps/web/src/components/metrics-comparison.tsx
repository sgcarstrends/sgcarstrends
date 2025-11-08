import { Chip } from "@heroui/chip";
import { formatPercent } from "@web/utils/charts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatsCompareProps {
  current: number;
  previousMonth: number;
}

interface TrendIndicatorProps {
  change: number;
  label: string;
}

const TrendIndicator = ({ change, label }: TrendIndicatorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Chip
        variant="flat"
        color={change >= 0 ? "success" : "danger"}
        startContent={
          change >= 0 ? (
            <ArrowUpRight className="size-4" />
          ) : (
            <ArrowDownRight className="size-4" />
          )
        }
      >
        {formatPercent(Math.abs(change), { maximumFractionDigits: 1 })}
      </Chip>
      <span className="text-muted-foreground text-sm">{label}</span>
    </div>
  );
};

export const MetricsComparison = ({
  current,
  previousMonth,
}: StatsCompareProps) => {
  const monthChange = (current - previousMonth) / previousMonth;

  return <TrendIndicator change={monthChange} label="vs last month" />;
};
