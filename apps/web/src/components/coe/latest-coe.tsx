import { Card, CardBody, CardHeader } from "@heroui/card";
import { AnimatedNumber } from "@web/components/animated-number";
import { Sparkline } from "@web/components/charts/sparkline";
import type { COETrendPoint } from "@web/queries/coe";
import type { COECategory, COEResult } from "@web/types";
import Link from "next/link";

interface LatestCOEProps {
  results: COEResult[];
  trends?: Record<COECategory, COETrendPoint[]>;
}

export const LatestCOE = ({ results, trends }: LatestCOEProps) => {
  // Format month for sparkline labels
  const formatMonth = (monthStr: string) => {
    const date = new Date(`${monthStr}-01`);
    return date.toLocaleDateString("en-SG", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Latest COE Results</h3>
        <Link href="/coe" className="text-primary text-sm hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {results.map((result) => {
          const categoryTrends = trends?.[result.vehicleClass] || [];
          const sparklineData = categoryTrends.map((point) => ({
            label: formatMonth(point.month),
            value: point.premium,
          }));

          return (
            <Card key={result.vehicleClass}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground text-xs lg:text-base">
                    {result.vehicleClass}
                  </h4>
                </div>
              </CardHeader>
              <CardBody className="flex flex-col gap-4">
                <div className="grid grid-cols-1 items-center gap-2 lg:grid-cols-2">
                  <div className="flex gap-1">
                    <span className="font-medium text-default-600">S$</span>
                    <div className="font-bold text-lg text-primary lg:text-xl">
                      <AnimatedNumber value={result.premium} />
                    </div>
                  </div>
                  {sparklineData.length > 0 && (
                    <Sparkline data={sparklineData} />
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
