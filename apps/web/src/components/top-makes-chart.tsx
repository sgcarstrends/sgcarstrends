"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import Typography from "@web/components/typography";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

interface TopMake {
  make: string;
  value: number;
}

interface TopMakesChartProps {
  topMakes: TopMake[];
  year: number;
}

export const TopMakesChart = ({ topMakes, year }: TopMakesChartProps) => {
  const data = [...topMakes].sort((a, b) => b.value - a.value);
  const chartConfig = Object.fromEntries(
    data.map(({ make }) => [
      make,
      {
        label: make,
        color: `var(--chart-1)`,
      },
    ]),
  ) as ChartConfig;

  return (
    <Card className="rounded-2xl border border-default-200 shadow-card-soft">
      <CardHeader className="flex flex-col items-start gap-2 pb-4">
        <Typography.H4>
          Top {topMakes.length} Car Makes ({year})
        </Typography.H4>
        <Typography.TextSm className="text-default-600">
          Most popular vehicle brands by registration volume
        </Typography.TextSm>
      </CardHeader>
      <CardBody className="pt-2">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} layout="vertical">
            <CartesianGrid horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              dataKey="make"
              type="category"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              hide
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="value" fill="var(--chart-1)" radius={4}>
              <LabelList
                dataKey="make"
                position="insideLeft"
                offset={8}
                className="fill-background"
              />
              <LabelList
                dataKey="value"
                position="right"
                className="fill-foreground"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardBody>
    </Card>
  );
};
