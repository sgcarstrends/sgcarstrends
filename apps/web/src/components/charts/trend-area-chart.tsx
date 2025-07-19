"use client";

import { useMemo } from "react";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  chartColorPalette,
  formatMonthYear,
  formatNumber,
} from "@/utils/chart-formatters";

interface TrendData {
  month: string;
  total: number;

  [key: string]: number | string;
}

interface TrendAreaChartProps {
  data: TrendData[];
  title: string;
  subtitle?: string;
  categories: string[];
  colours?: string[];
  showTotal?: boolean;
  height?: string;
  valueFormatter?: (value: number) => string;
}

export const TrendAreaChart = ({
  data,
  title,
  subtitle,
  categories,
  colours = chartColorPalette.slice(0, categories.length),
  showTotal = false,
  height = "h-80",
  valueFormatter = formatNumber,
}: TrendAreaChartProps) => {
  const formattedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      month: formatMonthYear(item.month),
    }));
  }, [data]);

  const displayCategories = useMemo(
    () => (showTotal ? ["total", ...categories] : categories),
    [categories, showTotal],
  );
  const displayColours = useMemo(
    () => (showTotal ? ["#6b7280", ...colours] : colours),
    [colours, showTotal],
  );

  // Create chart config for shadcn/ui
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    displayCategories.forEach((category, index) => {
      config[category] = {
        label: category.charAt(0).toUpperCase() + category.slice(1),
        color: displayColours[index] || `hsl(${index * 30}, 70%, 50%)`,
      };
    });
    return config;
  }, [displayCategories, displayColours]);

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
          <div
            className={`${height} flex items-center justify-center rounded-lg bg-gray-50`}
          >
            <p className="text-gray-500">No trend data available</p>
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
        <ChartContainer
          config={chartConfig}
          className={`${height} min-h-[320px]`}
        >
          <AreaChart
            data={formattedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={60}
              tickFormatter={valueFormatter}
              className="text-xs"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {displayCategories.map((category, index) => (
              <Area
                key={category}
                type="natural"
                dataKey={category}
                stackId="1"
                stroke={displayColours[index]}
                fill={displayColours[index]}
                fillOpacity={0.8}
                strokeWidth={2}
                connectNulls={true}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
