import { SkeletonCard } from "@web/components/shared/skeleton";
import { getYearlyRegistrations } from "@web/queries/cars";
import { Suspense } from "react";
import { KeyStatistics } from "./key-statistics";

async function KeyStatisticsSectionContent() {
  const yearlyData = await getYearlyRegistrations();
  return <KeyStatistics data={yearlyData} />;
}

export const KeyStatisticsSection = () => {
  return (
    <Suspense fallback={<SkeletonCard className="h-96" />}>
      <KeyStatisticsSectionContent />
    </Suspense>
  );
};
