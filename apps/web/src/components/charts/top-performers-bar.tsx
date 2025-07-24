"use client";

import { useMemo } from "react";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getRankingEmoji } from "@/utils/api/cars";
import {
  formatNumber,
  formatPercentage,
  getColorForIndex,
} from "@/utils/chart-formatters";

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
  onValueChange?: (value: any) => void;
}

export const TopPerformersBar = ({
  data,
  title,
  subtitle,
  maxItems = 10,
  showRankings = true,
  showPercentages = true,
  onValueChange,
}: TopPerformersBarProps) => {
  const formattedData = useMemo(() => {
    return data.slice(0, maxItems).map((item, index) => ({
      name: item.name,
      value: item.count,
      percentage: formatPercentage(item.percentage),
      rank: item.rank,
      fill: getColorForIndex(index),
    }));
  }, [data, maxItems]);

  // Create chart config for shadcn/ui
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {
      value: {
        label: "Value",
        color: "hsl(var(--chart-1))",
      },
    };
    formattedData.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      };
    });
    return config;
  }, [formattedData]);

  const valueFormatter = (value: number) => {
    const item = data.find((d) => d.count === value);
    if (!item) return formatNumber(value);

    return showPercentages
      ? `${formatNumber(value)} (${formatPercentage(item.percentage)})`
      : formatNumber(value);
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50">
            <p className="text-gray-500">No performance data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        {showRankings && formattedData.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {formattedData.slice(0, 3).map((item, index) => (
                <Badge
                  key={index}
                  variant={index === 0 ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  <span>{getRankingEmoji(item.rank)}</span>
                  <span className="max-w-[100px] truncate">{item.name}</span>
                  <span className="text-xs">({item.percentage})</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <ChartContainer config={chartConfig} className="h-64 min-h-[256px]">
          <BarChart
            data={formattedData}
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
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Showing top {maxItems} of {data.length} items
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
