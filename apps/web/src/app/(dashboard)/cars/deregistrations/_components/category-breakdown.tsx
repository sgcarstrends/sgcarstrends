"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import Typography from "@web/components/typography";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface CategoryData {
  category: string;
  total: number;
}

interface Props {
  data: CategoryData[];
  month: string;
}

export const CategoryBreakdown = ({ data, month }: Props) => {
  const numberFormatter = new Intl.NumberFormat("en-SG");

  const chartConfig = {
    total: { label: "Deregistrations", color: "hsl(var(--heroui-danger))" },
  } as const;

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-1">
        <Typography.H3>Deregistrations by Category</Typography.H3>
        <Typography.TextSm className="text-default-500">
          {month}
        </Typography.TextSm>
      </CardHeader>
      <CardBody>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart data={data} layout="vertical">
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => numberFormatter.format(value)}
            />
            <YAxis
              type="category"
              dataKey="category"
              tickLine={false}
              axisLine={false}
              width={180}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              content={
                <ChartTooltipContent
                  formatter={(value) => numberFormatter.format(value as number)}
                />
              }
            />
            <Bar
              dataKey="total"
              fill="hsl(var(--heroui-danger))"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardBody>
    </Card>
  );
};
