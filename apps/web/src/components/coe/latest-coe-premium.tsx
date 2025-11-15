import { Card, CardBody, CardHeader } from "@heroui/card";
import { AnimatedNumber } from "@web/components/animated-number";
import { Sparkline } from "@web/components/charts/sparkline";
import Typography from "@web/components/typography";
import type { CoeMonthlyPremium } from "@web/queries/coe";
import type { COECategory, COEResult } from "@web/types";

interface LatestCoePremiumProps {
  results: COEResult[];
  trends?: Record<COECategory, CoeMonthlyPremium[]>;
}

export const LatestCoePremium = ({
  results,
  trends,
}: LatestCoePremiumProps) => {
  return (
    <>
      {results.map((result) => {
        const categoryTrends = trends?.[result.vehicleClass] || [];
        const sparklineData = categoryTrends.map((point) => ({
          value: point.premium,
        }));

        return (
          <Card key={result.vehicleClass}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Typography.H4>{result.vehicleClass}</Typography.H4>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-medium text-default-600">S$</span>
                  <div className="font-bold text-2xl text-primary">
                    <AnimatedNumber value={result.premium} />
                  </div>
                </div>
                {sparklineData.length > 0 && <Sparkline data={sparklineData} />}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </>
  );
};
