import { redis, slugify } from "@sgcarstrends/utils";
import { MakeDetail } from "@web/app/(main)/(explore)/cars/components/makes";
import { AnimatedSection } from "@web/app/(main)/(explore)/components/animated-section";
import { DashboardPageHeader } from "@web/components/dashboard-page-header";
import { DashboardPageMeta } from "@web/components/dashboard-page-meta";
import { DashboardPageTitle } from "@web/components/dashboard-page-title";
import { MonthSelector } from "@web/components/shared/month-selector";
import { SkeletonCard } from "@web/components/shared/skeleton";
import { StructuredData } from "@web/components/structured-data";
import { LAST_UPDATED_CARS_KEY } from "@web/config";
import {
  createPageMetadata,
  createWebPageStructuredData,
} from "@web/lib/metadata";
import { getDistinctMakes, getMakeDetails } from "@web/queries/cars";
import { getMakeCoeComparison } from "@web/queries/cars/makes/coe-comparison";
import {
  getMakeFuelTypeBreakdown,
  getMakeVehicleTypeBreakdown,
} from "@web/queries/cars/makes/entity-breakdowns";
import { getMakeFromSlug } from "@web/queries/cars/makes/get-make-from-slug";
import type { Make } from "@web/types";
import { fetchMonthsForCars, getMonthOrLatest } from "@web/utils/dates/months";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { loadSearchParams } from "./search-params";

interface PageProps {
  params: Promise<{ make: Make }>;
  searchParams: Promise<SearchParams>;
}

export async function generateStaticParams() {
  const makes = await getDistinctMakes();
  return makes.map(({ make }) => ({ make: slugify(make) }));
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { make } = await params;

  const exactMake = make.toUpperCase().replaceAll("-", " ");

  const title = `${exactMake} Cars Overview: Registration Trends`;
  const description = `${exactMake} cars overview. Historical car registration trends and monthly breakdown by fuel and vehicle types in Singapore.`;

  const images = `/api/og?title=${exactMake}&subtitle=Stats by Make`;

  return createPageMetadata({
    title,
    description,
    canonical: `/cars/makes/${make}`,
    images,
  });
};

export default async function CarMakePage({
  params,
  searchParams: searchParamsPromise,
}: PageProps) {
  return (
    <div className="flex flex-col gap-4">
      <DashboardPageHeader
        title={
          <DashboardPageTitle
            title="Make Overview"
            subtitle="Historical car registration trends and monthly breakdown by fuel and vehicle types in Singapore."
          />
        }
        meta={
          <Suspense fallback={<SkeletonCard className="h-10 w-40" />}>
            <CarMakeHeaderMeta
              params={params}
              searchParams={searchParamsPromise}
            />
          </Suspense>
        }
      />

      <AnimatedSection order={1}>
        <Suspense fallback={<SkeletonCard className="h-10 w-40" />}>
          <CarMakeContent params={params} searchParams={searchParamsPromise} />
        </Suspense>
      </AnimatedSection>
    </div>
  );
}

async function CarMakeHeaderMeta({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ make: Make }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ make }, { month: parsedMonth }, months, lastUpdated] =
    await Promise.all([
      paramsPromise,
      loadSearchParams(searchParamsPromise),
      fetchMonthsForCars(),
      redis.get<number>(LAST_UPDATED_CARS_KEY),
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

async function CarMakeContent({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ make: Make }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ make }, { month: parsedMonth }] = await Promise.all([
    paramsPromise,
    loadSearchParams(searchParamsPromise),
  ]);

  const exactMake = await getMakeFromSlug(make);
  if (!exactMake) {
    return notFound();
  }

  const { month } = await getMonthOrLatest(parsedMonth, "cars");

  const [coeComparison, makeDetails, fuelTypeBreakdown, vehicleTypeBreakdown] =
    await Promise.all([
      getMakeCoeComparison(exactMake),
      getMakeDetails(exactMake, month),
      getMakeFuelTypeBreakdown(exactMake, month),
      getMakeVehicleTypeBreakdown(exactMake, month),
    ]);

  const cars = {
    make: exactMake,
    total: makeDetails.total,
    data: makeDetails.data,
  };

  const title = `${exactMake} Cars Overview: Registration Trends`;
  const description = `${exactMake} cars overview. Historical car registration trends and monthly breakdown by fuel and vehicle types in Singapore.`;
  const structuredData = createWebPageStructuredData(
    title,
    description,
    `/cars/makes/${make}`,
  );

  return (
    <>
      <StructuredData data={structuredData} />
      <Suspense fallback={<SkeletonCard className="h-[560px] w-full" />}>
        <MakeDetail
          cars={cars}
          coeComparison={coeComparison}
          fuelTypeBreakdown={fuelTypeBreakdown}
          vehicleTypeBreakdown={vehicleTypeBreakdown}
        />
      </Suspense>
    </>
  );
}
