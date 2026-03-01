import { CarCostTable } from "@web/app/(main)/(explore)/cars/costs/components/car-cost-table";
import { FuelTypeCostChart } from "@web/app/(main)/(explore)/cars/costs/components/fuel-type-cost-chart";
import { SummaryMetrics } from "@web/app/(main)/(explore)/cars/costs/components/summary-metrics";
import { VesDistributionChart } from "@web/app/(main)/(explore)/cars/costs/components/ves-distribution-chart";
import { AnimatedSection } from "@web/app/(main)/(explore)/components/animated-section";
import { DashboardPageHeader } from "@web/components/dashboard-page-header";
import { DashboardPageTitle } from "@web/components/dashboard-page-title";
import { EmptyState } from "@web/components/shared/empty-state";
import { Infobox } from "@web/components/shared/infobox";
import { PAGE_CONTEXTS } from "@web/components/shared/page-contexts";
import { StructuredData } from "@web/components/structured-data";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { getLatestCarCosts } from "@web/queries/car-costs";
import { DollarSign } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import type { WebPage, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Car Cost Breakdown | New Car Prices in Singapore",
  description:
    "See how new car prices in Singapore are composed — OMV, ARF, VES rebates/surcharges, and COE premiums for every model.",
  openGraph: {
    title: "Car Cost Breakdown - New Car Prices in Singapore",
    description:
      "Understand the full cost of buying a new car in Singapore with OMV, ARF, VES, and COE breakdown.",
    type: "website",
  },
  alternates: {
    canonical: "/cars/costs",
  },
};

const structuredData: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Car Cost Breakdown",
  description:
    "Breakdown of new car costs in Singapore including OMV, ARF, VES rebates/surcharges, and COE premiums for all available models",
  url: `${SITE_URL}/cars/costs`,
  publisher: {
    "@type": "Organization",
    name: SITE_TITLE,
    url: SITE_URL,
  },
};

export default async function CarCostsPage() {
  const data = await getLatestCarCosts();

  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-10">
        <DashboardPageHeader
          title={
            <DashboardPageTitle
              title="Car Cost Breakdown"
              subtitle="See how new car prices are composed — OMV, ARF, VES, and COE."
            />
          }
        />

        <AnimatedSection order={1}>
          <Infobox {...PAGE_CONTEXTS.carCosts} />
        </AnimatedSection>

        {data.length === 0 ? (
          <EmptyState
            icon={
              <div className="flex size-16 items-center justify-center rounded-2xl bg-default-100">
                <DollarSign className="size-8 text-default-400" />
              </div>
            }
            title="No Cost Data Available"
            description="Car cost data has not been ingested yet. Data will be available once the LTA Car Cost Update is processed."
            showDefaultActions={false}
          />
        ) : (
          <>
            <AnimatedSection order={2}>
              <SummaryMetrics data={data} />
            </AnimatedSection>

            <AnimatedSection order={3}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <FuelTypeCostChart data={data} />
                </div>
                <div className="lg:col-span-2">
                  <VesDistributionChart data={data} />
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection order={4}>
              <Suspense>
                <CarCostTable data={data} />
              </Suspense>
            </AnimatedSection>
          </>
        )}
      </section>
    </>
  );
}
