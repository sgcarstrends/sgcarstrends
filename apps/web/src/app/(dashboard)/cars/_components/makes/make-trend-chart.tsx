"use client";

import Typography from "@web/components/typography";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@web/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

interface Props {
  data: any[];
}

export const MakeTrendChart = ({ data }: Props) => {
  const monthlyTotals: { [key: string]: number } = {};
  for (const item of data) {
    const month = item.month;
    const count = item.count ?? item.number ?? 0;
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
        <div>
          <Typography.H4 className="mb-2 text-foreground">
            Registration Trends
          </Typography.H4>
          <Typography.BodySmall className="text-muted-foreground">
            This chart shows monthly registration trends over time.
            {peakMonth &&
              `Peak registrations occurred in ${peakMonth.month} with ${peakMonth.count.toLocaleString()} vehicles`}
            , helping identify seasonal patterns and market performance.
          </Typography.BodySmall>
        </div>
        <div className="grid grid-cols-1 gap-3 rounded-lg bg-muted/30 p-3 sm:grid-cols-3">
          <div className="text-center">
            <Typography.BodyLarge className="font-medium text-foreground">
              {peakMonth?.month || "N/A"}
            </Typography.BodyLarge>
            <Typography.Caption className="text-muted-foreground">
              Peak Month
            </Typography.Caption>
          </div>
          <div className="text-center">
            <Typography.BodyLarge className="font-medium text-foreground">
              {totalRegistrations.toLocaleString()}
            </Typography.BodyLarge>
            <Typography.Caption className="text-muted-foreground">
              Total Period
            </Typography.Caption>
          </div>
          <div className="text-center">
            <Typography.BodyLarge className="font-medium text-foreground">
              {chartData.length}
            </Typography.BodyLarge>
            <Typography.Caption className="text-muted-foreground">
              Months Tracked
            </Typography.Caption>
          </div>
        </div>
      </div>
    </>
  );
};

const chartConfig = {
  count: { label: "Count" },
} satisfies ChartConfig;
