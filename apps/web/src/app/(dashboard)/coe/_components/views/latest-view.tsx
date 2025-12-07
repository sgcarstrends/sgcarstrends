import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { PremiumRangeCard } from "@web/app/(dashboard)/coe/_components/premium-range-card";
import { AnimatedNumber } from "@web/components/animated-number";
import Typography from "@web/components/typography";
import type { PremiumRangeStats } from "@web/lib/coe/calculations";
import { formatPercent } from "@web/utils/charts";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import Link from "next/link";

interface LatestViewProps {
  categoryAPercentage: number;
  premiumRangeStats: PremiumRangeStats[];
  latestPqpMonth: string;
  latestPqpRates: Record<string, number>;
}

export const LatestView = ({
  categoryAPercentage,
  premiumRangeStats,
  latestPqpMonth,
  latestPqpRates,
}: LatestViewProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Typography.H2>Fun Facts</Typography.H2>
        <Card>
          <CardHeader className="flex flex-col items-start gap-2">
            <h3 className="font-medium text-foreground text-xl">
              Category A vs B
            </h3>
            <p className="text-default-600 text-sm">
              Will the premium quota of Category A ever surpass Category B?
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 text-muted-foreground">
                <Progress value={categoryAPercentage * 100} size="md" />
                <div className="text-center">
                  <span className="font-bold text-lg text-primary">
                    {formatPercent(categoryAPercentage, {
                      maximumFractionDigits: 1,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Typography.H2>Premium Ranges</Typography.H2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <PremiumRangeCard stats={premiumRangeStats} />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-start gap-2">
          <h3 className="font-medium text-foreground text-xl">
            Latest PQP Rates
          </h3>
          <p className="text-default-600 text-sm">
            {latestPqpMonth &&
              `Prevailing Quota Premium rates for ${formatDateToMonthYear(latestPqpMonth)}`}
          </p>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            {Object.entries(latestPqpRates)
              .filter(([key]) =>
                [
                  "Category A",
                  "Category B",
                  "Category C",
                  "Category D",
                ].includes(key),
              )
              .map(([category, rate]) => (
                <div
                  key={category}
                  className="flex items-center justify-between border-b pb-2 last-of-type:border-none"
                >
                  <Typography.H4>{category}</Typography.H4>
                  <Typography.Lead className="text-primary">
                    S$
                    <AnimatedNumber value={rate} />
                  </Typography.Lead>
                </div>
              ))}
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex w-full flex-col gap-2">
            <Typography.TextSm>
              Note: There is no PQP Premium for Category E
            </Typography.TextSm>
            <Link href="/coe/pqp">
              <Button className="w-full">View All PQP Rates</Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
