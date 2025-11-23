"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

interface YearlyData {
  year: number;
  total: number;
}

interface YearOverYearChartProps {
  data: YearlyData[];
  numberFormatter: Intl.NumberFormat;
}

/**
 * Year-over-year change bar chart component
 *
 * Displays annual registration changes as a bar chart with positive/negative
 * coloring. Shows the last 10 years of year-over-year changes.
 */
export const YearOverYearChart = ({
  data,
  numberFormatter,
}: YearOverYearChartProps) => {
  const yoySeries = useMemo(
    () =>
      data
        .map((d, i) => {
          const prev = data[i - 1];
          if (!prev) return null;
          return { year: d.year, change: d.total - prev.total };
        })
        .filter(Boolean) as { year: number; change: number }[],
    [data],
  );

  const recent = useMemo(() => yoySeries.slice(-10), [yoySeries]);

  if (recent.length === 0) return null;

  const chartConfig = {
    plus: { color: "var(--success)" },
    minus: { color: "var(--destructive)" },
  } as const;

  return (
    <div>
      <ChartContainer
        config={chartConfig}
        className="h-[300px] w-full"
        aria-label="YoY change bar chart last 10"
      >
        <BarChart data={recent} margin={{ left: 8, right: 8 }}>
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
          <ReferenceLine
            y={0}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="3 3"
          />
          <Bar dataKey="change">
            {recent.map((d) => (
              <Cell
                key={d.year}
                fill={
                  d.change >= 0 ? "var(--color-plus)" : "var(--color-minus)"
                }
              />
            ))}
            <LabelList
              dataKey="change"
              position="top"
              className="fill-foreground font-mono text-[10px]"
              formatter={(v: number) => numberFormatter.format(v)}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};
