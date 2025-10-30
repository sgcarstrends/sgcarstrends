"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@web/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface Props {
  data: Array<{
    date: string;
    count: number;
  }>;
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  count: {
    label: "Count",
  },
} satisfies ChartConfig;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const VisitorTrendsChart = ({ data }: Props) => {
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toISOString().split("T")[0], // Format as YYYY-MM-DD
  }));

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 border-b lg:flex-row lg:items-center lg:justify-between">
        <div className="grid flex-1 gap-1">
          <CardTitle>Visitor Trends</CardTitle>
          <CardDescription>All-time page views</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart accessibilityLayer data={formattedData}>
            <CartesianGrid />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDate}
            />
            <YAxis axisLine={true} tickLine={true} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={formatDate}
                />
              }
            />
            <Line dataKey="count" type="monotone" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
