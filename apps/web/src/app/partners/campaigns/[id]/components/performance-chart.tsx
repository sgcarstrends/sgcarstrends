"use client";

import type { SelectCampaignEvent } from "@sgcarstrends/database";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface PerformanceChartProps {
  data: SelectCampaignEvent[];
}

const chartConfig = {
  impressions: {
    label: "Impressions",
    color: "var(--chart-1)",
  },
  clicks: {
    label: "Clicks",
    color: "var(--chart-2)",
  },
};

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data
    .slice()
    .reverse()
    .map((event) => ({
      date: format(event.date, "MMM d"),
      impressions: event.impressions,
      clicks: event.clicks,
    }));

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="impressions"
          fill="var(--chart-1)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="clicks"
          fill="var(--chart-2)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
