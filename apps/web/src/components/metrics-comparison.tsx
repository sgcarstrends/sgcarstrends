import { TrendingDown, TrendingUp } from "lucide-react";
import { formatPercent } from "@/utils/format-percent";

interface StatsCompareProps {
  current: number;
  previousMonth: number;
}

interface TrendIndicatorProps {
  change: number;
  label: string;
}

const TrendIndicator = ({ change, label }: TrendIndicatorProps) => (
  <div className="flex items-center gap-1">
    <span
      className={`flex items-center gap-1 ${change >= 0 ? "text-green-600" : "text-red-600"}`}
    >
      {change >= 0 ? (
        <TrendingUp className="size-4" />
      ) : (
        <TrendingDown className="size-4" />
      )}
      {formatPercent(Math.abs(change), { maximumFractionDigits: 1 })}
    </span>
    <span className="text-muted-foreground text-sm">{label}</span>
  </div>
);

export const MetricsComparison = ({
  current,
  previousMonth,
}: StatsCompareProps) => {
  const monthChange = (current - previousMonth) / previousMonth;

  return (
    <div className="flex flex-col gap-1">
      <TrendIndicator change={monthChange} label="vs. Last Month" />
    </div>
  );
};
