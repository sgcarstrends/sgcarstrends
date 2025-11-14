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

interface SparklineProps {
  data: SparklineData[];
  dataKey?: string;
  height?: string;
}

export const Sparkline = ({
  data,
  dataKey = "value",
  height = "h-16",
}: SparklineProps) => {
  const chartConfig = {} satisfies ChartConfig;

  if (data.length === 0) {
    return null;
  }

  return (
    <ChartContainer config={chartConfig} className={cn("w-full", height)}>
      <AreaChart data={data}>
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="var(--primary)"
          strokeWidth={2}
          dot={false}
          animationDuration={300}
        />
      </AreaChart>
    </ChartContainer>
  );
};
