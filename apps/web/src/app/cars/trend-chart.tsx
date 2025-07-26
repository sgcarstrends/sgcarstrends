"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@web/components/ui/chart";

interface Props {
  data: any[];
}

export const TrendChart = ({ data }: Props) => {
  const chartData = data.slice(0, 10);
  const totalRegistrations = chartData.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  const topMake = chartData[0];

  const chartConfig = {
    count: {
      label: "Count",
    },
    label: { color: "var(--background)" },
  } satisfies ChartConfig;

  return (
    <>
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          aria-label={`Top ${chartData.length} car makes by registration count, showing ${chartData[0]?.make || "most popular"} leading with ${chartData[0]?.count || 0} registrations`}
        >
          <XAxis type="number" dataKey="count" hide />
          <YAxis
            dataKey="make"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            hide
          />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Bar dataKey="count" fill="var(--primary)">
            <LabelList
              dataKey="make"
              position="insideLeft"
              offset={8}
              className="fill-(--color-label)"
              fontSize={12}
            />
            <LabelList
              dataKey="count"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <div className="mt-4 space-y-3">
        <div className="text-muted-foreground text-sm">
          <h4 className="text-foreground mb-2 font-semibold">Market Leaders</h4>
          <p>
            This chart shows the top 10 car makes by registration count.
            {topMake &&
              `${topMake.make} leads with ${topMake.count.toLocaleString()} registrations`}
            , representing the most popular vehicle brands among Singapore
            consumers.
          </p>
        </div>
        <div className="bg-muted/30 grid grid-cols-1 gap-3 rounded-lg p-3 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-foreground text-lg font-semibold">
              {topMake?.make || "N/A"}
            </div>
            <div className="text-muted-foreground text-xs">Top Make</div>
          </div>
          <div className="text-center">
            <div className="text-foreground text-lg font-semibold">
              {totalRegistrations.toLocaleString()}
            </div>
            <div className="text-muted-foreground text-xs">Total Shown</div>
          </div>
          <div className="text-center">
            <div className="text-foreground text-lg font-semibold">
              {chartData.length}
            </div>
            <div className="text-muted-foreground text-xs">Makes Displayed</div>
          </div>
        </div>
      </div>
    </>
  );
};
