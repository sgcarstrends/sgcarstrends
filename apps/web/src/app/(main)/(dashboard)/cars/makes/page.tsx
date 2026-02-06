import type { CarLogo } from "@logos/types";
import { redis } from "@sgcarstrends/utils";
import { MakesDashboard } from "@web/app/(main)/(dashboard)/cars/components/makes";
import { AnimatedSection } from "@web/app/(main)/(dashboard)/components/animated-section";
import { DashboardPageHeader } from "@web/components/dashboard-page-header";
import { DashboardPageMeta } from "@web/components/dashboard-page-meta";
import { DashboardPageTitle } from "@web/components/dashboard-page-title";
import { MonthSelector } from "@web/components/shared/month-selector";
import { SkeletonCard } from "@web/components/shared/skeleton";
import { StructuredData } from "@web/components/structured-data";
import { LAST_UPDATED_CARS_KEY, SITE_TITLE, SITE_URL } from "@web/config";
import { createPageMetadata } from "@web/lib/metadata";
import {
  checkMakeIfExist,
  getDistinctMakes,
  getMakeDetails,
  getPopularMakes,
} from "@web/queries/cars";
import { getMakeCoeComparison } from "@web/queries/cars/makes/coe-comparison";
import { fetchMonthsForCars, getMonthOrLatest } from "@web/utils/dates/months";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import type { WebPage, WithContext } from "schema-dts";
import { loadSearchParams } from "./search-params";

const title = "Makes";
const description =
  "Comprehensive overview of car makes in Singapore. Explore popular brands, discover all available manufacturers, and view registration trends and market statistics.";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export const generateMetadata = async (): Promise<Metadata> => {
  return createPageMetadata({
    title,
    description,
    canonical: "/cars/makes",
  });
};

const CarMakesPage = ({ searchParams }: PageProps) => {
  return (
    <div className="flex flex-col gap-4">
      <DashboardPageHeader
        title={
          <DashboardPageTitle
            title="Makes"
            subtitle="List of car makes registered in Singapore."
          />
        }
        meta={
          <Suspense fallback={<SkeletonCard className="h-10 w-40" />}>
            <CarMakesHeaderMeta searchParams={searchParams} />
          </Suspense>
        }
      />
      <AnimatedSection order={1}>
        <Suspense fallback={<SkeletonCard className="h-[560px] w-full" />}>
          <CarMakesContent searchParams={searchParams} />
        </Suspense>
      </AnimatedSection>
    </div>
  );
};

async function CarMakesHeaderMeta({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [{ month: parsedMonth }, months, lastUpdated] = await Promise.all([
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

async function CarMakesContent({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { make: selectedMakeSlug, month: parsedMonth } =
    await loadSearchParams(searchParamsPromise);
  const logos = await redis.get<CarLogo[]>("logos:all");
  const [allMakes, popularMakes, lastUpdated] = await Promise.all([
    getDistinctMakes(),
    getPopularMakes(),
    redis.get<number>(LAST_UPDATED_CARS_KEY),
  ]);
  const { month } = await getMonthOrLatest(parsedMonth, "cars");

  const makes = allMakes.map((item) => item.make);
  const popular = popularMakes.map((item) => item.make);
  let selectedMakeData = null;

  if (selectedMakeSlug) {
    const makeExists = await checkMakeIfExist(selectedMakeSlug);
    if (makeExists) {
      const [makeDetails, coeComparison, logo] = await Promise.all([
        getMakeDetails(selectedMakeSlug, month),
        getMakeCoeComparison(selectedMakeSlug),
        redis.get<CarLogo>(`logo:${selectedMakeSlug}`),
      ]);
      const makeName = makeExists.make;
      selectedMakeData = {
        make: makeName,
        cars: {
          make: makeName,
          total: makeDetails.total,
          data: makeDetails.data,
        },
        lastUpdated,
        logo,
        coeComparison,
      };
    }
  }

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/cars/makes`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <MakesDashboard
        makes={makes}
        popularMakes={popular}
        logos={logos}
        selectedMakeData={selectedMakeData}
      />
    </>
  );
}

export default CarMakesPage;
