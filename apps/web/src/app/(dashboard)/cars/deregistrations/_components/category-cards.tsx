"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { AnimatedNumber } from "@web/components/animated-number";
import { Sparkline } from "@web/components/charts/sparkline";
import Typography from "@web/components/typography";
import type { CategorySparklineData } from "@web/lib/deregistrations/transforms";

interface CategoryCardsProps {
  categories: CategorySparklineData[];
}

const calculateTrend = (
  data: { value: number }[],
): "up" | "down" | "neutral" | undefined => {
  if (data.length < 2) return undefined;

  const first = data[0].value;
  const last = data[data.length - 1].value;

  if (last > first) return "up";
  if (last < first) return "down";
  return "neutral";
};

export const CategoryCards = ({ categories }: CategoryCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((item) => {
        const trend = calculateTrend(item.trend);

        return (
          <Card key={item.category}>
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2">
                <div
                  className="size-4 rounded-full"
                  style={{ backgroundColor: item.colour }}
                />
                <Typography.H4>{item.category}</Typography.H4>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 items-center gap-2">
                <div className="font-bold text-2xl text-primary">
                  <AnimatedNumber value={item.total} />
                </div>
                {item.trend.length > 0 && (
                  <Sparkline data={item.trend} trend={trend} />
                )}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};
