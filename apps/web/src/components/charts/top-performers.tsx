"use client";

import { Badge } from "@sgcarstrends/ui/components/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import { ChartWidget } from "@web/components/charts/widget";
import { getRankingEmoji } from "@web/lib/cars/calculations";
import {
  formatNumber,
  formatPercentage,
  getColorForIndex,
} from "@web/utils/charts";
import { useCallback, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface TopPerformerData {
  name: string;
  count: number;
  percentage: number;
  rank: number;
}

interface TopPerformersBarProps {
  data: TopPerformerData[];
  title: string;
  subtitle?: string;
  maxItems?: number;
  showRankings?: boolean;
  showPercentages?: boolean;
}

export const TopPerformersBar = ({
  data,
  title,
  subtitle,
  maxItems = 10,
  showRankings = true,
  showPercentages = true,
}: TopPerformersBarProps) => {
  // Consolidate data transformations and create value lookup Map
  const { chartData, chartConfig, valueMap } = useMemo(() => {
    const topItems = data.slice(0, maxItems);

    const chartData = topItems.map((item, index) => ({
      name: item.name,
      value: item.count,
      percentage: formatPercentage(item.percentage),
      rank: item.rank,
      fill: getColorForIndex(index),
    }));

    const chartConfig = Object.fromEntries([
      ["value", { label: "Value", color: "hsl(var(--chart-1))" }],
      ...topItems.map((item, index) => [
        item.name,
        { label: item.name, color: getColorForIndex(index) },
      ]),
    ]);

    // Create Map for O(1) lookup instead of O(n) find
    const valueMap = new Map(
      topItems.map((item) => [item.count, item.percentage]),
    );

    return { chartData, chartConfig, valueMap };
  }, [data, maxItems]);

  // Memoize valueFormatter with Map lookup for O(1) performance
  const valueFormatter = useCallback(
    (value: number) => {
      const percentage = valueMap.get(value);
      if (!percentage) return formatNumber(value);

      return showPercentages
        ? `${formatNumber(value)} (${formatPercentage(percentage)})`
        : formatNumber(value);
    },
    [valueMap, showPercentages],
  );

  return (
    <ChartWidget
      title={title}
      subtitle={subtitle}
      isEmpty={!data || data.length === 0}
      emptyMessage="No performance data available"
    >
      <div className="flex flex-col gap-6">
        {showRankings && chartData.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chartData.slice(0, 3).map((item, index) => (
              <Badge
                key={item.name}
                variant={index === 0 ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                <span>{getRankingEmoji(item.rank)}</span>
                <span className="max-w-[100px] truncate">{item.name}</span>
                <span className="text-xs">({item.percentage})</span>
              </Badge>
            ))}
          </div>
        )}

        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={chartData}
            layout="horizontal"
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickFormatter={valueFormatter}
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              className="text-xs"
              width={100}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>

        {data.length > maxItems && (
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Showing top {maxItems} of {data.length} items
            </p>
          </div>
        )}
      </div>
    </ChartWidget>
  );
};
