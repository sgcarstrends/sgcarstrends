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
import { formatNumber, formatPercentage } from "@web/utils/charts";
import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

interface MarketShareData {
  name: string;
  count: number;
  percentage: number;
  colour: string;
}

interface MarketShareDonutProps {
  data: MarketShareData[];
  title: string;
  subtitle?: string;
  variant?: "donut" | "pie";
  showLegend?: boolean;
  onValueChange?: (value: any) => void;
}

export const MarketShareDonut = ({
  data,
  title,
  subtitle,
  variant = "donut",
  showLegend = true,
  onValueChange,
}: MarketShareDonutProps) => {
  // Consolidate all data transformations into single useMemo
  const { chartData, chartConfig, legendData } = useMemo(() => {
    const chartData = data.map((item) => ({
      name: item.name,
      value: item.count,
      fill: item.colour,
    }));

    const chartConfig = Object.fromEntries(
      data.map((item) => [item.name, { label: item.name, color: item.colour }]),
    );

    const legendData = data.map((item) => ({
      name: item.name,
      colour: item.colour,
      value: formatNumber(item.count),
    }));

    return { chartData, chartConfig, legendData };
  }, [data]);

  // Calculate statistics for commentary
  const shareStatistics = useMemo(() => {
    if (!data || data.length === 0) return null;

    const topSegment = data.reduce(
      (maxItem, currentItem) =>
        currentItem.count > maxItem.count ? currentItem : maxItem,
      data[0],
    );
    const totalCount = data.reduce(
      (accumulator, item) => accumulator + item.count,
      0,
    );

    return {
      topSegmentName: topSegment.name,
      topSegmentPercentage: topSegment.percentage,
      totalCount,
      segmentCount: data.length,
    };
  }, [data]);

  return (
    <ChartWidget
      title={title}
      subtitle={subtitle}
      isEmpty={!data || data.length === 0}
      emptyMessage="No market share data available"
    >
      <div className="flex flex-col gap-6">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <Pie
              data={chartData}
              labelLine={false}
              innerRadius={variant === "donut" ? 40 : 0}
              fill="#8884d8"
              dataKey="value"
              onClick={onValueChange}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
          </PieChart>
        </ChartContainer>

        {showLegend && (
          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            {legendData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="size-4 shrink-0 rounded-full"
                    style={{ backgroundColor: item.colour }}
                  />
                  <span className="truncate text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        )}
        {shareStatistics && (
          <div className="flex flex-col gap-4">
            <div>
              <Typography.H4>Distribution Overview</Typography.H4>
              <Typography.TextSm>
                This chart shows market share distribution across{" "}
                {shareStatistics.segmentCount} segments.
                {shareStatistics.topSegmentName &&
                  ` ${shareStatistics.topSegmentName} leads with ${formatPercentage(shareStatistics.topSegmentPercentage)} of the market`}
                , providing insight into the competitive landscape and consumer
                preferences in Singapore.
              </Typography.TextSm>
            </div>
            <div className="grid grid-cols-1 gap-3 rounded-lg bg-muted/30 p-3 sm:grid-cols-3">
              <div className="text-center">
                <Typography.TextLg>
                  {shareStatistics.topSegmentName}
                </Typography.TextLg>
                <Typography.Caption>Top Segment</Typography.Caption>
              </div>
              <div className="text-center">
                <Typography.TextLg>
                  {formatNumber(shareStatistics.totalCount)}
                </Typography.TextLg>
                <Typography.Caption>Total Count</Typography.Caption>
              </div>
              <div className="text-center">
                <Typography.TextLg>
                  {shareStatistics.segmentCount}
                </Typography.TextLg>
                <Typography.Caption>Segments</Typography.Caption>
              </div>
            </div>
          </div>
        )}
      </div>
    </ChartWidget>
  );
};
