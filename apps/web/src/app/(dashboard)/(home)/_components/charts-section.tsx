import { SkeletonChart } from "@web/components/shared/skeleton";
import { TopMakesByYear } from "@web/components/top-makes-by-year";
import { TotalNewCarRegistrationsByYear } from "@web/components/total-new-car-registrations-by-year";
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
      <TotalNewCarRegistrationsByYear data={yearlyData} />
      {latestYear && <TopMakesByYear topMakes={topMakes} year={latestYear} />}
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

export function ChartsSection() {
  return (
    <Suspense fallback={<ChartsSectionSkeleton />}>
      <ChartsSectionContent />
    </Suspense>
  );
}
