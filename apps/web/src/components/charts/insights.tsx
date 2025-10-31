"use client";

import { AnimatedNumber } from "@web/components/animated-number";
import { Badge } from "@web/components/ui/badge";
import { Card, CardContent } from "@web/components/ui/card";
import { cn } from "@web/lib/utils";
import { formatGrowthRate } from "@web/utils/charts";
import {
  Award,
  BarChart3,
  PieChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";

type DeltaType = "increase" | "decrease" | "unchanged";

interface InsightData {
  title: string;
  value: number;
  delta?: number;
  deltaType?: DeltaType;
  icon?: ReactNode;
  colour?: string;
  subtitle?: string;
}

interface InsightCardsProps {
  insights: InsightData[];
}

export const InsightCards = ({ insights }: InsightCardsProps) => {
  const getDeltaVariant = (deltaType?: DeltaType) => {
    switch (deltaType) {
      case "increase":
        return "default";
      case "decrease":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getDeltaIcon = (deltaType?: DeltaType) => {
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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {insights.map((insight) => (
        <Card key={insight.title}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start space-x-4">
              <div className="min-w-0 flex-1">
                <p className="mb-1 font-medium text-gray-600 text-sm">
                  {insight.title}
                </p>
                <p className="break-words font-bold text-gray-900 text-xl sm:text-2xl">
                  <AnimatedNumber value={insight.value} />
                </p>
                {insight.subtitle && (
                  <p className="mt-1 text-gray-500 text-xs">
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
                <p className="text-gray-500 text-xs">from previous month</p>
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
  value: number,
  options: {
    delta?: number;
    deltaType?: DeltaType;
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
  award: <Award className="size-4" />,
  barChart: <BarChart3 className="size-4" />,
  pieChart: <PieChart className="size-4" />,
  trendingUp: <TrendingUp className="size-4" />,
  trendingDown: <TrendingDown className="size-4" />,
} as const;
