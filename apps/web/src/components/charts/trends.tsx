"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@sgcarstrends/ui/components/chart";
import { ChartWidget } from "@web/components/charts/widget";
import Typography from "@web/components/typography";
import {
  chartColorPalette,
  formatMonthYear,
  formatNumber,
} from "@web/utils/charts";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  valueFormatter?: (value: number) => string;
}

export const TrendAreaChart = ({
  data,
  title,
  subtitle,
  categories,
  colours = chartColorPalette.slice(0, categories.length),
  showTotal = false,
  valueFormatter = formatNumber,
}: TrendAreaChartProps) => {
  // Format data inline (cheap operation, no need to memoize)
  const formattedData = data.map((item) => ({
    ...item,
    month: formatMonthYear(item.month),
  }));

  // Compute display values inline (cheap array operations)
  const displayCategories = useMemo(
    () => (showTotal ? ["total", ...categories] : categories),
    [showTotal, categories],
  );
  const displayColours = useMemo(
    () => (showTotal ? ["#6b7280", ...colours] : colours),
    [showTotal, colours],
  );

  // Only memoize the expensive chart config object creation
  const chartConfig = useMemo(() => {
    return Object.fromEntries(
      displayCategories.map((category, index) => [
        category,
        {
          label: category.charAt(0).toUpperCase() + category.slice(1),
          color: displayColours[index] || `hsl(${index * 30}, 70%, 50%)`,
        },
      ]),
    );
  }, [displayCategories, displayColours]);

  // Calculate statistics for commentary
  const trendStatistics = useMemo(() => {
    if (!data || data.length === 0) return null;

    const peakDataPoint = data.reduce(
      (maxItem, currentItem) =>
        currentItem.total > maxItem.total ? currentItem : maxItem,
      data[0],
    );
    const overallTotal = data.reduce(
      (accumulator, item) => accumulator + item.total,
      0,
    );

    return {
      dataPointCount: data.length,
      peakMonth: formatMonthYear(peakDataPoint.month),
      peakValue: peakDataPoint.total,
      overallTotal,
    };
  }, [data]);

  return (
    <ChartWidget
      title={title}
      subtitle={subtitle}
      isEmpty={!data || data.length === 0}
      emptyMessage="No trend data available"
    >
      <div className="flex flex-col gap-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
        {trendStatistics && (
          <div className="flex flex-col gap-4">
            <div>
              <Typography.H4>Trend Analysis</Typography.H4>
              <Typography.TextSm>
                This chart visualises trends across {categories.length}{" "}
                {categories.length === 1 ? "category" : "categories"} over{" "}
                {trendStatistics.dataPointCount} data points.
                {trendStatistics.peakMonth &&
                  ` Peak activity occurred in ${trendStatistics.peakMonth} with ${formatNumber(trendStatistics.peakValue)} registrations`}
                , helping identify seasonal patterns and market dynamics in
                Singapore.
              </Typography.TextSm>
            </div>
            <div className="grid grid-cols-1 gap-3 rounded-lg bg-muted/30 p-3 sm:grid-cols-3">
              <div className="text-center">
                <Typography.TextLg>
                  {trendStatistics.peakMonth}
                </Typography.TextLg>
                <Typography.Caption>Peak Month</Typography.Caption>
              </div>
              <div className="text-center">
                <Typography.TextLg>
                  {formatNumber(trendStatistics.overallTotal)}
                </Typography.TextLg>
                <Typography.Caption>Total Period</Typography.Caption>
              </div>
              <div className="text-center">
                <Typography.TextLg>{categories.length}</Typography.TextLg>
                <Typography.Caption>Categories Tracked</Typography.Caption>
              </div>
            </div>
          </div>
        )}
      </div>
    </ChartWidget>
  );
};
