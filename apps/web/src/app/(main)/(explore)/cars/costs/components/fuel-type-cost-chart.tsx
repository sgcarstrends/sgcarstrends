"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { cn } from "@heroui/theme";
import type { SelectCarCost } from "@sgcarstrends/database";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import { formatCurrency } from "@sgcarstrends/utils";
import Typography from "@web/components/typography";
import {
  CARD_PADDING,
  CHART_CURSOR,
  CHART_GRID,
  CHART_HEIGHTS,
  RADIUS,
} from "@web/config/design-system";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

interface FuelTypeCostChartProps {
  data: SelectCarCost[];
}

const FUEL_TYPE_ORDER = ["E", "R", "H", "P"];

const FUEL_TYPE_LABELS: Record<string, string> = {
  E: "Electric",
  R: "Petrol-Electric (Plug-In)",
  H: "Petrol-Electric",
  P: "Petrol",
};

const chartConfig = {
  avgCost: { label: "Avg Selling Price (w/ COE)", color: "var(--chart-1)" },
};

export function FuelTypeCostChart({ data }: FuelTypeCostChartProps) {
  const grouped = new Map<string, number[]>();
  for (const item of data) {
    if (!item.fuelType || item.sellingPriceWithCoe === 0) continue;
    const costs = grouped.get(item.fuelType) ?? [];
    costs.push(item.sellingPriceWithCoe);
    grouped.set(item.fuelType, costs);
  }

  const chartData = FUEL_TYPE_ORDER.filter((fuelType) =>
    grouped.has(fuelType),
  ).map((fuelType) => {
    const costs = grouped.get(fuelType)!;
    const average = costs.reduce((sum, cost) => sum + cost, 0) / costs.length;
    return {
      fuelType: FUEL_TYPE_LABELS[fuelType] ?? fuelType,
      avgCost: Math.round(average),
    };
  });

  return (
    <Card className={cn(RADIUS.card, CARD_PADDING.standard)}>
      <CardHeader className="flex flex-col items-start gap-2">
        <Typography.H4>Avg Selling Price by Fuel Type</Typography.H4>
        <Typography.TextSm className="text-default-500">
          Average AD selling price (with COE) by fuel type
        </Typography.TextSm>
      </CardHeader>
      <CardBody>
        <ChartContainer
          config={chartConfig}
          className={cn(CHART_HEIGHTS.tall, "w-full")}
        >
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid {...CHART_GRID.default} horizontal={false} />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <YAxis
              type="category"
              dataKey="fuelType"
              tickLine={false}
              axisLine={false}
              width={160}
            />
            <ChartTooltip
              cursor={CHART_CURSOR.highlight}
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(value as number)}
                />
              }
            />
            <Bar dataKey="avgCost" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.fuelType}
                  fill={`var(--chart-${Math.min(index + 1, 6)})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardBody>
      <CardFooter>
        <Typography.TextSm className="text-default-500">
          Electric vehicles tend to have lower total costs due to VES rebates.
        </Typography.TextSm>
      </CardFooter>
    </Card>
  );
}
