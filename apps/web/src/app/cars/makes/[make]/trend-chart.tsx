"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
  data: any[];
}

export const TrendChart = ({ data }: Props) => {
  const monthlyTotals: { [key: string]: number } = {};
  for (const { month, count } of data) {
    if (monthlyTotals[month]) {
      monthlyTotals[month] += count;
    } else {
      monthlyTotals[month] = count;
    }
  }

  const chartData = Object.entries(monthlyTotals).map(([month, count]) => ({
    month,
    count,
  }));

  const totalRegistrations = chartData.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  const peakMonth = chartData.reduce(
    (max, item) => (item.count > max.count ? item : max),
    chartData[0] || {
      month: "N/A",
      count: 0,
    },
  );

  return (
    <>
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          aria-label={`Monthly registration trend chart showing ${chartData.length} months of data with ${chartData.reduce((sum, item) => sum + item.count, 0)} total registrations`}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickMargin={8} />
          <ChartTooltip
            content={<ChartTooltipContent indicator="line" label />}
          />
          <Line
            dataKey="count"
            type="monotone"
            fill="var(--primary)"
            stroke="var(--primary)"
            strokeWidth={2}
          />
        </LineChart>
      </ChartContainer>
      <div className="mt-4 space-y-3">
        <div className="text-muted-foreground text-sm">
          <h4 className="text-foreground mb-2 font-semibold">
            Registration Trends
          </h4>
          <p>
            This chart shows monthly registration trends over time.
            {peakMonth &&
              `Peak registrations occurred in ${peakMonth.month} with ${peakMonth.count.toLocaleString()} vehicles`}
            , helping identify seasonal patterns and market performance.
          </p>
        </div>
        <div className="bg-muted/30 grid grid-cols-1 gap-3 rounded-lg p-3 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-foreground text-lg font-semibold">
              {peakMonth?.month || "N/A"}
            </div>
            <div className="text-muted-foreground text-xs">Peak Month</div>
          </div>
          <div className="text-center">
            <div className="text-foreground text-lg font-semibold">
              {totalRegistrations.toLocaleString()}
            </div>
            <div className="text-muted-foreground text-xs">Total Period</div>
          </div>
          <div className="text-center">
            <div className="text-foreground text-lg font-semibold">
              {chartData.length}
            </div>
            <div className="text-muted-foreground text-xs">Months Tracked</div>
          </div>
        </div>
      </div>
    </>
  );
};

const chartConfig = {
  count: { label: "Count" },
} satisfies ChartConfig;
