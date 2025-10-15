"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@web/components/ui/chart";
import { formatNumber, formatPercentage } from "@web/utils/chart-formatters";
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
  const formattedData = useMemo(() => {
    return data.map((item) => ({
      name: item.name,
      value: item.count,
      share: formatPercentage(item.percentage),
      fill: item.colour,
    }));
  }, [data]);

  const legendData = useMemo(() => {
    return data.map((item, _index) => ({
      name: item.name,
      colour: item.colour,
      value: formatNumber(item.count),
    }));
  }, [data]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    data.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.colour,
      };
    });
    return config;
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold text-gray-900 text-lg">
            {title}
          </CardTitle>
          {subtitle && <p className="mt-1 text-gray-600 text-sm">{subtitle}</p>}
        </CardHeader>
        <CardContent>
          <div className="flex h-60 items-center justify-center rounded-lg bg-gray-50">
            <p className="text-gray-500">No market share data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold text-gray-900 text-lg">
          {title}
        </CardTitle>
        {subtitle && <p className="mt-1 text-gray-600 text-sm">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <PieChart>
              <Pie
                data={formattedData}
                labelLine={false}
                innerRadius={variant === "donut" ? 40 : 0}
                fill="#8884d8"
                dataKey="value"
                onClick={onValueChange}
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            </PieChart>
          </ChartContainer>

          {showLegend && (
            <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {legendData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: item.colour }}
                  />
                  <span className="truncate text-gray-600">{item.name}</span>
                  <span className="ml-auto font-medium text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
