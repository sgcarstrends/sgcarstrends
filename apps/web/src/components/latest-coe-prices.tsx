"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import useStore from "@web/app/store";
import { AnimatedNumber } from "@web/components/animated-number";
import { formatOrdinal } from "@web/utils/format-ordinal";
import type { COEResult } from "@web/types";

interface LatestCOEPricesProps {
  results: COEResult[];
}

export const LatestCOEPrices = ({ results }: LatestCOEPricesProps) => {
  const { categories } = useStore();
  const filteredResults = results.filter(
    (result) => categories[result.vehicle_class as keyof typeof categories],
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredResults.map((result) => (
        <Card
          key={result.vehicle_class}
          className="border-small border-foreground/10 from-background to-default-100 relative overflow-hidden bg-gradient-to-br shadow-lg transition-shadow duration-300 hover:shadow-xl"
        >
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
                <h4 className="text-foreground text-lg font-semibold">
                  {result.vehicle_class}
                </h4>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-default-600 text-lg font-medium">S$</span>
              <div className="text-primary text-2xl font-bold lg:text-4xl">
                <AnimatedNumber value={result.premium} />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
