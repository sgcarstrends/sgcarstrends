import { formatDateToMonthYear } from "@sgcarstrends/utils";
import { CategoryTabs } from "@web/app/(main)/(dashboard)/cars/category-tabs";
import { TopMakes } from "@web/app/(main)/(dashboard)/cars/components/top-makes";
import { loadSearchParams } from "@web/app/(main)/(dashboard)/cars/search-params";
import { TrendsCompareButton } from "@web/app/(main)/(dashboard)/cars/trends-compare-button";
import { AnimatedSection } from "@web/app/(main)/(dashboard)/components/animated-section";
import { DashboardPageHeader } from "@web/components/dashboard-page-header";
import { DashboardPageMeta } from "@web/components/dashboard-page-meta";
import { DashboardPageTitle } from "@web/components/dashboard-page-title";
import { MetricCard } from "@web/components/shared/metric-card";
import { MonthSelector } from "@web/components/shared/month-selector";
import { PageContext } from "@web/components/shared/page-context";
import { PAGE_CONTEXTS } from "@web/components/shared/page-contexts";
import { SkeletonCard } from "@web/components/shared/skeleton";
import { StructuredData } from "@web/components/structured-data";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { loadCarsMetadataData } from "@web/lib/cars/page-data";
import { loadLastUpdated } from "@web/lib/common";
import { createPageMetadata, generateDatasetSchema } from "@web/lib/metadata";
import {
  getCarsComparison,
  getCarsData,
  getTopMakesByFuelType,
  getTopTypes,
} from "@web/queries";
import { fetchMonthsForCars, getMonthOrLatest } from "@web/utils/dates/months";
import { formatVehicleType } from "@web/utils/formatting/format-vehicle-type";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import type { WebPage, WithContext } from "schema-dts";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export const generateMetadata = async ({
  searchParams,
}: PageProps): Promise<Metadata> => {
  const { month: parsedMonth } = await loadSearchParams(searchParams);
  const { month } = await getMonthOrLatest(parsedMonth, "cars");

  const formattedMonth = formatDateToMonthYear(month);

  const title = `${formattedMonth} Car Registrations`;
  const description = `Discover ${formattedMonth} car registrations in Singapore. See detailed stats by fuel type, vehicle type, and top brands.`;

  const { topTypes, carRegistration } = await loadCarsMetadataData(month);
  const images = `/api/og?title=Car Registrations&subtitle=Monthly Stats Summary&month=${month}&total=${carRegistration.total}&topFuelType=${topTypes.topFuelType.name}&topVehicleType=${topTypes.topVehicleType.name}`;

  return createPageMetadata({
    title,
    description,
    canonical: `/cars?month=${month}`,
    images,
    includeAuthors: true,
  });
};

const Page = ({ searchParams }: PageProps) => {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title={
          <DashboardPageTitle
            title="Car Registrations"
            subtitle="Monthly new car registrations in Singapore by fuel type and vehicle type."
          />
        }
        meta={
          <Suspense fallback={<SkeletonCard className="h-10 w-40" />}>
            <CarsPageHeaderMeta searchParams={searchParams} />
          </Suspense>
        }
      />

      <Suspense fallback={<SkeletonCard className="h-[720px] w-full" />}>
        <CarsPageContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default Page;

async function CarsPageHeaderMeta({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [{ month: parsedMonth }, months, lastUpdated] = await Promise.all([
    loadSearchParams(searchParamsPromise),
    fetchMonthsForCars(),
    loadLastUpdated("cars"),
  ]);
  const { wasAdjusted } = await getMonthOrLatest(parsedMonth, "cars");

  return (
    <DashboardPageMeta lastUpdated={lastUpdated}>
      <MonthSelector
        months={months}
        latestMonth={months[0]}
        wasAdjusted={wasAdjusted}
      />
    </DashboardPageMeta>
  );
}

async function CarsPageContent({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { month: parsedMonth } = await loadSearchParams(searchParamsPromise);
  const { month } = await getMonthOrLatest(parsedMonth, "cars");

  const [cars, comparison, topTypes, topMakes] = await Promise.all([
    getCarsData(month),
    getCarsComparison(month),
    getTopTypes(month),
    getTopMakesByFuelType(month),
  ]);

  if (!cars) {
    return notFound();
  }

  const formattedMonth = formatDateToMonthYear(month);

  const title = `${formattedMonth} Car Registrations`;
  const description = `Discover ${formattedMonth} car registrations in Singapore. See detailed stats by fuel type, vehicle type, and top brands.`;
  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/cars`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <StructuredData
        data={{ "@context": "https://schema.org", ...generateDatasetSchema() }}
      />
      <AnimatedSection order={1}>
        <PageContext {...PAGE_CONTEXTS.cars} />
      </AnimatedSection>

      <AnimatedSection order={2}>
        <Suspense fallback={<SkeletonCard className="h-12 w-52" />}>
          <UnreleasedFeature>
            <TrendsCompareButton />
          </UnreleasedFeature>
        </Suspense>
      </AnimatedSection>

      <div className="flex flex-col gap-4">
        <AnimatedSection order={3}>
          <Suspense fallback={<SkeletonCard className="h-[240px] w-full" />}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="Total Registrations"
                value={cars.total}
                current={cars.total}
                previousMonth={comparison.previousMonth.total}
              />
              <MetricCard
                title={`Top Fuel Type: ${topTypes.topFuelType.name}`}
                value={topTypes.topFuelType.total}
                current={topTypes.topFuelType.total}
                previousMonth={
                  comparison.previousMonth.fuelType.find(
                    (fuelType) => fuelType.label === topTypes.topFuelType.name,
                  )?.count ?? 0
                }
              />
              <MetricCard
                title={`Top Vehicle Type: ${formatVehicleType(topTypes.topVehicleType.name)}`}
                value={topTypes.topVehicleType.total}
                current={topTypes.topVehicleType.total}
                previousMonth={
                  comparison.previousMonth.vehicleType.find(
                    (vehicleType) =>
                      vehicleType.label === topTypes.topVehicleType.name,
                  )?.count ?? 0
                }
              />
            </div>
          </Suspense>
        </AnimatedSection>
        <AnimatedSection order={4}>
          <Suspense fallback={<SkeletonCard className="h-[420px] w-full" />}>
            <CategoryTabs cars={cars} />
          </Suspense>
        </AnimatedSection>
        <AnimatedSection order={5}>
          <Suspense fallback={<SkeletonCard className="h-[320px] w-full" />}>
            <TopMakes data={topMakes} />
          </Suspense>
        </AnimatedSection>
      </div>
    </>
  );
}
