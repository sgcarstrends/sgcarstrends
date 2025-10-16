import { Card, CardBody, CardHeader } from "@heroui/card";
import { AnimatedNumber } from "@web/components/animated-number";
import type { COEResult } from "@web/types";
import Link from "next/link";

interface LatestCOEProps {
  results: COEResult[];
}

export const LatestCOE = ({ results }: LatestCOEProps) => {
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
          return (
            <Card key={result.vehicle_class}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground text-xs lg:text-base">
                    {result.vehicle_class}
                  </h4>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex gap-1">
                  <span className="font-medium text-default-600">S$</span>
                  <div className="font-bold text-lg text-primary lg:text-xl">
                    <AnimatedNumber value={result.premium} />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
