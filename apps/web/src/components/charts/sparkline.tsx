"use client";

import { cn } from "@heroui/react";
import {
  type ChartConfig,
  ChartContainer,
} from "@sgcarstrends/ui/components/chart";
import { Area, AreaChart } from "recharts";

interface SparklineData {
  value: number;
}

type Trend = "up" | "down" | "neutral";

interface SparklineProps {
  data: SparklineData[];
  dataKey?: string;
  height?: string;
  trend?: Trend;
}

const getTrendColor = (trend?: Trend): string => {
  switch (trend) {
    case "up":
      return "hsl(var(--heroui-success))";
    case "down":
      return "hsl(var(--heroui-danger))";
    case "neutral":
      return "hsl(var(--heroui-warning))";
    default:
      return "hsl(var(--heroui-primary))";
  }
};

export const Sparkline = ({
  data,
  dataKey = "value",
  height = "h-16",
  trend,
}: SparklineProps) => {
  const chartConfig = {} satisfies ChartConfig;

  if (data.length === 0) {
    return null;
  }

  const strokeColor = getTrendColor(trend);
  const gradientId = `sparklineGradient-${trend ?? "default"}`;

  return (
    <ChartContainer config={chartConfig} className={cn("w-full", height)}>
      <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          dot={false}
          animationDuration={300}
        />
      </AreaChart>
    </ChartContainer>
  );
};
