import { RegistrationTrend } from "@web/components/registration-trend";
import { SkeletonChart } from "@web/components/shared/skeleton";
import { TopMakesChart } from "@web/components/top-makes-chart";
import { getTopMakesByYear, getYearlyRegistrations } from "@web/queries/cars";
import { Suspense } from "react";

async function ChartsSectionContent() {
  const [yearlyData, topMakes] = await Promise.all([
    getYearlyRegistrations(),
    getTopMakesByYear(),
  ]);

  const latestYear = yearlyData.at(-1)?.year;

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <RegistrationTrend data={yearlyData} />
      {latestYear && <TopMakesChart topMakes={topMakes} year={latestYear} />}
    </section>
  );
}

function ChartsSectionSkeleton() {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SkeletonChart />
      <SkeletonChart />
    </section>
  );
}

export const ChartsSection = () => {
  return (
    <Suspense fallback={<ChartsSectionSkeleton />}>
      <ChartsSectionContent />
    </Suspense>
  );
};
