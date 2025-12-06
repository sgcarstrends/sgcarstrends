"use client";

import { Card, CardBody } from "@heroui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import { formatNumber, formatPercentage } from "@web/utils/charts";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

interface CategoryWithPercentage {
  category: string;
  total: number;
  percentage: number;
  colour: string;
}

interface Props {
  data: CategoryWithPercentage[];
}

export const CategoryBreakdown = ({ data }: Props) => {
  const chartConfig = {
    total: { label: "Deregistrations", color: "hsl(var(--heroui-primary))" },
  } as const;

  // Sort by total descending for better visualization
  const sortedData = [...data].sort((a, b) => b.total - a.total);

  return (
    <Card className="h-full">
      <CardBody className="p-4">
        <h3 className="mb-3 font-medium text-default-500 text-xs uppercase tracking-wider">
          Distribution
        </h3>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={sortedData} layout="vertical">
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--heroui-default-200))"
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatNumber}
              tick={{ fill: "hsl(var(--heroui-default-500))" }}
            />
            <YAxis
              type="category"
              dataKey="category"
              tickLine={false}
              axisLine={false}
              width={100}
              tick={{ fill: "hsl(var(--heroui-default-600))" }}
              tickFormatter={(value: string) =>
                value
                  .replace("Category ", "")
                  .replace("Vehicles Exempted From VQS", "VQS")
              }
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              content={
                <ChartTooltipContent
                  formatter={(value, _name, item) => {
                    const percentage = (item.payload as CategoryWithPercentage)
                      .percentage;
                    return `${formatNumber(value as number)} (${formatPercentage(percentage)})`;
                  }}
                />
              }
            />
            <Bar dataKey="total" radius={[0, 4, 4, 0]}>
              {sortedData.map((entry) => (
                <Cell key={entry.category} fill={entry.colour} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardBody>
    </Card>
  );
};
