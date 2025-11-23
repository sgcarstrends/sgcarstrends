"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import { ChartWithStats } from "@web/components/charts/chart-with-stats";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

interface MakeData {
  make: string;
  count: number;
}

interface Props {
  data: MakeData[];
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

  const chart = (
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
  );

  const description = (
    <div>
      <h4 className="mb-2 font-semibold text-foreground">Market Leaders</h4>
      <p>
        This chart shows the top 10 car makes by registration count.
        {topMake &&
          ` ${topMake.make} leads with ${topMake.count.toLocaleString()} registrations`}
        , representing the most popular vehicle brands among Singapore
        consumers.
      </p>
    </div>
  );

  const stats = [
    { label: "Top Make", value: topMake?.make || "N/A" },
    { label: "Total Shown", value: totalRegistrations.toLocaleString() },
    { label: "Makes Displayed", value: chartData.length },
  ];

  return (
    <ChartWithStats chart={chart} stats={stats} description={description} />
  );
};
