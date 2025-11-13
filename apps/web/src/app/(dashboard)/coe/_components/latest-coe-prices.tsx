"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import useStore from "@web/app/store";
import { AnimatedNumber } from "@web/components/animated-number";
import Typography from "@web/components/typography";
import type { COEResult } from "@web/types";

interface LatestCOEPricesProps {
  results: COEResult[];
}

export const LatestCOEPrices = ({ results }: LatestCOEPricesProps) => {
  const { categories } = useStore();
  const filteredResults = results.filter(
    (result) => categories[result.vehicleClass as keyof typeof categories],
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredResults.map((result) => (
        <Card
          key={result.vehicleClass}
          className="relative overflow-hidden border-foreground/10 border-small bg-gradient-to-br from-background to-default-100 shadow-lg transition-shadow duration-300 hover:shadow-xl"
        >
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <Typography.H4>{result.vehicleClass}</Typography.H4>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-medium text-default-600 text-lg">S$</span>
              <div className="font-bold text-2xl text-primary lg:text-4xl">
                <AnimatedNumber value={result.premium} />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
