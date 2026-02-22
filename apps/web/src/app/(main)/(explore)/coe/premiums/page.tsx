import { FunFactsPqpSection } from "@web/app/(main)/(explore)/coe/premiums/components/fun-facts-pqp-section";
import { KeyInsightsSection } from "@web/app/(main)/(explore)/coe/premiums/components/key-insights-section";
import { LatestResultsSection } from "@web/app/(main)/(explore)/coe/premiums/components/latest-results-section";
import { PremiumRangesSection } from "@web/app/(main)/(explore)/coe/premiums/components/premium-ranges-section";
import { AnimatedSection } from "@web/app/(main)/(explore)/components/animated-section";
import { DashboardPageHeader } from "@web/components/dashboard-page-header";
import { DashboardPageMeta } from "@web/components/dashboard-page-meta";
import { DashboardPageTitle } from "@web/components/dashboard-page-title";
import { PageContext } from "@web/components/shared/page-context";
import { PAGE_CONTEXTS } from "@web/components/shared/page-contexts";
import { SkeletonCard } from "@web/components/shared/skeleton";
import { loadLastUpdated } from "@web/lib/common";
import { createPageMetadata } from "@web/lib/metadata";
import { getLatestCoeResults } from "@web/queries/coe";
import type { Metadata } from "next";
import { Suspense } from "react";

const title = "COE Overview";
const description =
  "Certificate of Entitlement (COE) analysis hub for Singapore vehicle registration. View latest premiums, trends, and category-specific insights.";

export const generateMetadata = async (): Promise<Metadata> => {
  const results = await getLatestCoeResults();
  const categories = results.reduce<Record<string, number>>(
    (category, current) => {
      category[current.vehicleClass] = current.premium;
      return category;
    },
    {},
  );

  const images = `/api/og/coe?title=COE Overview&subtitle=Overview&biddingNo=2&categoryA=${categories["Category A"]}&categoryB=${categories["Category B"]}&categoryC=${categories["Category C"]}&categoryD=${categories["Category D"]}&categoryE=${categories["Category E"]}`;

  return createPageMetadata({
    title,
    description,
    canonical: "/coe/premiums",
    images,
    includeAuthors: true,
  });
};

const COEOverviewPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title={
          <DashboardPageTitle
            title="COE Overview"
            subtitle="Latest Certificate of Entitlement bidding results and premium trends."
          />
        }
        meta={
          <Suspense fallback={<SkeletonCard className="h-8 w-28" />}>
            <COEOverviewHeaderMeta />
          </Suspense>
        }
      />

      <AnimatedSection order={1}>
        <PageContext {...PAGE_CONTEXTS.coe} />
      </AnimatedSection>

      <AnimatedSection order={2}>
        <LatestResultsSection />
      </AnimatedSection>

      <AnimatedSection order={3}>
        <KeyInsightsSection />
      </AnimatedSection>

      <AnimatedSection order={4}>
        <FunFactsPqpSection />
      </AnimatedSection>

      <AnimatedSection order={5}>
        <PremiumRangesSection />
      </AnimatedSection>
    </div>
  );
};

async function COEOverviewHeaderMeta() {
  const lastUpdated = await loadLastUpdated("coe");

  return <DashboardPageMeta lastUpdated={lastUpdated} />;
}

export default COEOverviewPage;
