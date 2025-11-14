"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import useStore from "@web/app/store";
import { AnimatedNumber } from "@web/components/animated-number";
import { Sparkline } from "@web/components/charts/sparkline";
import Typography from "@web/components/typography";
import type { COETrendPoint } from "@web/queries/coe";
import type { COECategory, COEResult } from "@web/types";
import { Activity } from "react";

interface LatestCOEPricesProps {
  results: COEResult[];
  trends?: Record<COECategory, COETrendPoint[]>;
}

export const LatestCOEPrices = ({ results, trends }: LatestCOEPricesProps) => {
  const { categories } = useStore();
  const filteredResults = results.filter(
    (result) => categories[result.vehicleClass as keyof typeof categories],
  );

  // Format month for sparkline labels
  const formatMonth = (monthStr: string) => {
    const date = new Date(`${monthStr}-01`);
    return date.toLocaleDateString("en-SG", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredResults.map((result) => {
        const categoryTrends = trends?.[result.vehicleClass] || [];
        const sparklineData = categoryTrends.map((point) => ({
          label: formatMonth(point.month),
          value: point.premium,
        }));

        return (
          <Card
            key={result.vehicleClass}
            className="relative overflow-hidden border-foreground/10 border-small bg-gradient-to-br from-background to-default-100 shadow-lg transition-shadow duration-300 hover:shadow-xl"
          >
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="size-2 animate-pulse rounded-full bg-primary" />
                  <Typography.H4>{result.vehicleClass}</Typography.H4>
                </div>
              </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-4 pt-2">
              <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                <div className="flex items-baseline gap-1">
                  <span className="font-medium text-default-600 text-lg">
                    S$
                  </span>
                  <div className="font-bold text-2xl text-primary lg:text-4xl">
                    <AnimatedNumber value={result.premium} />
                  </div>
                </div>
                <Activity
                  mode={sparklineData.length > 0 ? "visible" : "hidden"}
                >
                  <Sparkline data={sparklineData} />
                </Activity>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};
