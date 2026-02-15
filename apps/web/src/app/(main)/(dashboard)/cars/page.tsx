import { formatDateToMonthYear } from "@sgcarstrends/utils";
import { CategoryTabsSection } from "@web/app/(main)/(dashboard)/cars/components/category-tabs-section";
import { MetricCardsSection } from "@web/app/(main)/(dashboard)/cars/components/metric-cards-section";
import { TopMakesFuelSection } from "@web/app/(main)/(dashboard)/cars/components/top-makes-section";
import { loadSearchParams } from "@web/app/(main)/(dashboard)/cars/search-params";
import { TrendsCompareButton } from "@web/app/(main)/(dashboard)/cars/trends-compare-button";
import { AnimatedSection } from "@web/app/(main)/(dashboard)/components/animated-section";
import { DashboardPageHeader } from "@web/components/dashboard-page-header";
import { DashboardPageMeta } from "@web/components/dashboard-page-meta";
import { DashboardPageTitle } from "@web/components/dashboard-page-title";
import { MonthSelector } from "@web/components/shared/month-selector";
import { PageContext } from "@web/components/shared/page-context";
import { PAGE_CONTEXTS } from "@web/components/shared/page-contexts";
import { SkeletonCard } from "@web/components/shared/skeleton";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { loadCarsMetadataData } from "@web/lib/cars/page-data";
import { loadLastUpdated } from "@web/lib/common";
import { createPageMetadata } from "@web/lib/metadata";
import { fetchMonthsForCars, getMonthOrLatest } from "@web/utils/dates/months";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

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

      <Suspense fallback={<SkeletonCard className="h-[720px] w-full" />}>
        <CarsPageSections searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

async function CarsPageSections({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { month: parsedMonth } = await loadSearchParams(searchParamsPromise);
  const { month } = await getMonthOrLatest(parsedMonth, "cars");

  return (
    <div className="flex flex-col gap-4">
      <AnimatedSection order={3}>
        <MetricCardsSection month={month} />
      </AnimatedSection>
      <AnimatedSection order={4}>
        <CategoryTabsSection month={month} />
      </AnimatedSection>
      <AnimatedSection order={5}>
        <TopMakesFuelSection month={month} />
      </AnimatedSection>
    </div>
  );
}

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
