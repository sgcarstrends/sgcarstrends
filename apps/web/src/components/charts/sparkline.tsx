"use client";

import { cn } from "@heroui/react";
import {
  type ChartConfig,
  ChartContainer,
} from "@sgcarstrends/ui/components/chart";
import { Line, LineChart } from "recharts";

interface SparklineData {
  label: string;
  value: number;
}

interface SparklineProps {
  data: SparklineData[];
  dataKey?: string;
  colour?: string;
  height?: string;
}

/**
 * Generic sparkline component for displaying minimal trend charts
 *
 * Displays a small, simplified line chart without axes or grid.
 * Ideal for showing trends in compact spaces like metric cards.
 *
 * @param data - Array of data points with label and value
 * @param dataKey - Key for the data value (default: "value")
 * @param color - CSS color variable (e.g., "var(--chart-1)")
 * @param height - Tailwind height class (default: "h-12")
 *
 * @example
 * ```tsx
 * <Sparkline
 *   data={[
 *     { label: "Jan 2024", value: 95000 },
 *     { label: "Feb 2024", value: 98000 },
 *   ]}
 *   color="var(--chart-1)"
 *   tooltipFormatter={(value) => `S$${value.toLocaleString()}`}
 * />
 * ```
 */
export const Sparkline = ({
  data,
  dataKey = "value",
  colour = "var(--primary)",
  height = "h-12",
}: SparklineProps) => {
  const chartConfig = {
    [dataKey]: {
      label: "Value",
      color: colour,
    },
  } satisfies ChartConfig;

  if (data.length === 0) {
    return null;
  }

  return (
    <ChartContainer config={chartConfig} className={cn("w-full", height)}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={colour}
          strokeWidth={2}
          dot={false}
          animationDuration={300}
        />
      </LineChart>
    </ChartContainer>
  );
};
