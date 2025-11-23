"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import Typography from "@web/components/typography";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface YearlyData {
  year: number;
  total: number;
}

interface MonthlyTrendChartProps {
  data: YearlyData[];
  chartColor: string;
  ariaLabel: string;
}

/**
 * Monthly trend area chart component
 *
 * Displays registration trends over time as an area chart.
 * Shows the last 10 data points with smooth area fill.
 */
export const MonthlyTrendChart = ({
  data,
  chartColor,
  ariaLabel,
}: MonthlyTrendChartProps) => {
  const recent = useMemo(() => data.slice(-10), [data]);

  if (recent.length < 2) {
    return (
      <div>
        <Typography.Caption>Not enough data to draw trend</Typography.Caption>
      </div>
    );
  }

  const chartConfig = {
    total: { label: "Total", color: "var(--primary)" },
  } as const;

  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className="h-[300px] w-full"
        aria-label={ariaLabel}
      >
        <AreaChart data={recent} margin={{ left: 8, right: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
          />
          <YAxis hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Area
            dataKey="total"
            type="monotone"
            stroke={`var(--color-total, ${chartColor})`}
            fill={`var(--color-total, ${chartColor})`}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
