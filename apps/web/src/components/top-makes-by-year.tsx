"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@web/components/ui/chart";
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

interface Top5CarMakesByYearProps {
  topMakes: TopMake[];
  year: number;
}

export const TopMakesByYear = ({ topMakes, year }: Top5CarMakesByYearProps) => {
  const data = [...topMakes].sort((a, b) => b.value - a.value);
  const chartConfig = Object.fromEntries(
    data.map(({ make }) => [
      make,
      {
        label: make,
        color: `var(--primary)`,
      },
    ]),
  ) as ChartConfig;

  return (
    <Card>
      <CardHeader>
        <h3>
          Top {topMakes.length} Car Makes ({year})
        </h3>
      </CardHeader>
      <CardBody>
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
            <Bar dataKey="value" fill="var(--primary)" radius={4}>
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
