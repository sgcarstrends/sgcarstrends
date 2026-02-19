import { FuelTypeBreakdown } from "@web/app/(main)/(dashboard)/annual/components/fuel-type-breakdown";
import { VehiclePopulationChart } from "@web/app/(main)/(dashboard)/annual/components/vehicle-population-chart";
import { VehiclePopulationMetrics } from "@web/app/(main)/(dashboard)/annual/components/vehicle-population-metrics";
import { AnimatedSection } from "@web/app/(main)/(dashboard)/components/animated-section";
import { DashboardPageHeader } from "@web/components/dashboard-page-header";
import { DashboardPageMeta } from "@web/components/dashboard-page-meta";
import { DashboardPageTitle } from "@web/components/dashboard-page-title";
import { EmptyState } from "@web/components/shared/empty-state";
import { SkeletonCard } from "@web/components/shared/skeleton";
import { YearSelector } from "@web/components/shared/year-selector";
import { StructuredData } from "@web/components/structured-data";
import { SITE_TITLE, SITE_URL } from "@web/config";
import {
  getVehiclePopulationByYearAndFuelType,
  getVehiclePopulationYearlyTotals,
  getVehiclePopulationYears,
} from "@web/queries/vehicle-population";
import { BarChart3 } from "lucide-react";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import type { WebPage, WithContext } from "schema-dts";
import { loadSearchParams } from "./search-params";

export const metadata: Metadata = {
  title: "Annual Vehicle Population | Singapore Trends",
  description:
    "Annual motor vehicle population in Singapore by fuel type. Track the growth of electric, hybrid, petrol, and diesel vehicles on Singapore roads.",
  openGraph: {
    title: "Annual Vehicle Population - Singapore",
    description:
      "Explore annual vehicle population trends in Singapore by fuel type with interactive charts and key statistics.",
    type: "website",
  },
  alternates: {
    canonical: "/annual",
  },
};

const structuredData: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Annual Vehicle Population",
  description:
    "Motor vehicle population in Singapore by type of fuel used, with interactive charts and year-over-year analysis",
  url: `${SITE_URL}/annual`,
  publisher: {
    "@type": "Organization",
    name: SITE_TITLE,
    url: SITE_URL,
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function AnnualPage({ searchParams: searchParamsPromise }: PageProps) {
  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-10">
        <DashboardPageHeader
          title={
            <DashboardPageTitle
              title="Vehicle Population"
              subtitle="Annual motor vehicle population in Singapore by type of fuel used."
            />
          }
          meta={
            <Suspense fallback={<SkeletonCard className="h-10 w-40" />}>
              <AnnualHeaderMeta searchParams={searchParamsPromise} />
            </Suspense>
          }
        />

        <Suspense fallback={<SkeletonCard className="h-[460px] w-full" />}>
          <AnnualContent searchParams={searchParamsPromise} />
        </Suspense>
      </section>
    </>
  );
}

async function AnnualHeaderMeta({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { year: parsedYear } = await loadSearchParams(searchParamsPromise);
  const availableYearsData = await getVehiclePopulationYears();

  if (availableYearsData.length === 0) {
    return null;
  }

  const years = availableYearsData.map(({ year }) => Number(year));
  const latestYear = years[0];
  const wasAdjusted = parsedYear !== null && !years.includes(parsedYear);

  return (
    <DashboardPageMeta>
      <YearSelector
        years={years}
        latestYear={latestYear}
        wasAdjusted={wasAdjusted}
      />
    </DashboardPageMeta>
  );
}

async function AnnualContent({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await loadSearchParams(searchParamsPromise);

  const [yearlyTotals, fuelTypeData, availableYearsData] = await Promise.all([
    getVehiclePopulationYearlyTotals(),
    getVehiclePopulationByYearAndFuelType(),
    getVehiclePopulationYears(),
  ]);

  if (availableYearsData.length === 0) {
    return (
      <EmptyState
        icon={
          <div className="flex size-16 items-center justify-center rounded-2xl bg-default-100">
            <BarChart3 className="size-8 text-default-400" />
          </div>
        }
        title="No Data Available Yet"
        description="Annual vehicle population data is not available at the moment. Please check back later."
        showDefaultActions={false}
      />
    );
  }

  return (
    <>
      <AnimatedSection order={1}>
        <VehiclePopulationMetrics
          yearlyTotals={yearlyTotals}
          fuelTypeData={fuelTypeData}
        />
      </AnimatedSection>

      <AnimatedSection order={2}>
        <VehiclePopulationChart
          data={fuelTypeData}
          availableYears={availableYearsData}
        />
      </AnimatedSection>

      <AnimatedSection order={3}>
        <FuelTypeBreakdown data={fuelTypeData} />
      </AnimatedSection>
    </>
  );
}

export default AnnualPage;
