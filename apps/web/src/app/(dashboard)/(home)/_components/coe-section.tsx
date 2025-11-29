import { LatestCoePremium } from "@web/components/coe/latest-coe-premium";
import { GridSkeleton, SectionSkeleton } from "@web/components/shared/skeleton";
import Typography from "@web/components/typography";
import { getAllCoeCategoryTrends, getLatestCoeResults } from "@web/queries/coe";
import Link from "next/link";
import { Suspense } from "react";

async function CoeSectionContent() {
  const [latestCoe, coeTrends] = await Promise.all([
    getLatestCoeResults(),
    getAllCoeCategoryTrends(),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Typography.H2>Latest COE Results</Typography.H2>
        <Link href="/coe" className="text-primary text-sm hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
        <LatestCoePremium results={latestCoe} trends={coeTrends} />
      </div>
    </div>
  );
}

function CoeSectionSkeleton() {
  return (
    <SectionSkeleton>
      <GridSkeleton count={5} />
    </SectionSkeleton>
  );
}

export function CoeSection() {
  return (
    <Suspense fallback={<CoeSectionSkeleton />}>
      <CoeSectionContent />
    </Suspense>
  );
}
