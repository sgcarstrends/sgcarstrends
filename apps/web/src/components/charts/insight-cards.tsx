"use client";

import type { ReactNode } from "react";
import {
  Award,
  BarChart3,
  PieChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AnimatedNumber } from "@web/components/animated-number";
import { Badge } from "@web/components/ui/badge";
import { Card, CardContent } from "@web/components/ui/card";
import { cn } from "@web/lib/utils";
import { formatGrowthRate } from "@web/utils/chart-formatters";

interface InsightData {
  title: string;
  value: string | number;
  delta?: number;
  deltaType?: "increase" | "decrease" | "unchanged";
  icon?: ReactNode;
  colour?: string;
  subtitle?: string;
}

interface InsightCardsProps {
  insights: InsightData[];
  columns?: number;
}

export const InsightCards = ({ insights, columns = 3 }: InsightCardsProps) => {
  const renderValue = (value: string | number): ReactNode => {
    if (typeof value === "number") {
      return <AnimatedNumber value={value} />;
    }
    return value;
  };

  const gridCols =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 3
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  const getDeltaVariant = (
    deltaType?: "increase" | "decrease" | "unchanged",
  ) => {
    switch (deltaType) {
      case "increase":
        return "default";
      case "decrease":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getDeltaIcon = (deltaType?: "increase" | "decrease" | "unchanged") => {
    switch (deltaType) {
      case "increase":
        return <TrendingUp className="h-3 w-3" />;
      case "decrease":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  if (!insights || insights.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No insights available</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${gridCols}`}>
      {insights.map((insight, index) => (
        <Card key={index}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start space-x-4">
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-sm font-medium text-gray-600">
                  {insight.title}
                </p>
                <p className="text-xl font-bold break-words text-gray-900 sm:text-2xl">
                  {renderValue(insight.value)}
                </p>
                {insight.subtitle && (
                  <p className="mt-1 text-xs text-gray-500">
                    {insight.subtitle}
                  </p>
                )}
              </div>
              {insight.icon && (
                <div
                  className={cn(
                    "flex-shrink-0 rounded-lg p-2",
                    insight.colour === "blue" && "bg-blue-100 text-blue-600",
                    insight.colour === "green" && "bg-green-100 text-green-600",
                    insight.colour === "yellow" &&
                      "bg-yellow-100 text-yellow-600",
                    insight.colour === "red" && "bg-red-100 text-red-600",
                    insight.colour === "purple" &&
                      "bg-purple-100 text-purple-600",
                    !insight.colour && "bg-blue-100 text-blue-600",
                  )}
                >
                  {insight.icon}
                </div>
              )}
            </div>

            {insight.delta !== undefined && (
              <div className="mt-4 flex items-center space-x-2">
                <Badge
                  variant={getDeltaVariant(insight.deltaType)}
                  className="flex items-center space-x-1"
                >
                  {getDeltaIcon(insight.deltaType)}
                  <span>{formatGrowthRate(insight.delta)}</span>
                </Badge>
                <p className="text-xs text-gray-500">from previous month</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const createInsightData = (
  title: string,
  value: string | number,
  options: {
    delta?: number;
    deltaType?: "increase" | "decrease" | "unchanged";
    icon?: ReactNode;
    colour?: string;
    subtitle?: string;
  } = {},
): InsightData => ({
  title,
  value,
  ...options,
});

export const defaultIcons = {
  award: <Award className="h-4 w-4" />,
  barChart: <BarChart3 className="h-4 w-4" />,
  pieChart: <PieChart className="h-4 w-4" />,
  trendingUp: <TrendingUp className="h-4 w-4" />,
  trendingDown: <TrendingDown className="h-4 w-4" />,
} as const;
