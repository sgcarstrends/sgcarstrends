"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sgcarstrends/ui/components/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface Props {
  data: Array<{
    pathname: string;
    count: number;
  }>;
}

const chartConfig = {
  count: {
    label: "Views",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export const PageViewsChart = ({ data }: Props) => {
  const formattedData = data.slice(0, 8).map((item) => ({
    ...item,
    displayPath:
      item.pathname.length > 20
        ? `${item.pathname.substring(0, 20)}...`
        : item.pathname,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Pages</CardTitle>
        <CardDescription>Most visited pages by view count</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={formattedData}
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="displayPath"
              axisLine={false}
              tickLine={false}
              width={100}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, _name) => [`${value} views`, "Page Views"]}
                  labelFormatter={(label) => {
                    const page = formattedData.find(
                      (item) => item.displayPath === label,
                    );
                    return page ? page.pathname : label;
                  }}
                />
              }
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
