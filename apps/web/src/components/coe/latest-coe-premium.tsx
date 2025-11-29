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
        const trend = calculateTrend(sparklineData);

        return (
          <Card key={result.vehicleClass}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Typography.H4>{result.vehicleClass}</Typography.H4>
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-1">
                  <span className="font-medium text-default-600">S$</span>
                  <div className="font-bold text-2xl text-primary">
                    <AnimatedNumber value={result.premium} />
                  </div>
                </div>
                {sparklineData.length > 0 && (
                  <Sparkline data={sparklineData} height="h-10" trend={trend} />
                )}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </>
  );
};
