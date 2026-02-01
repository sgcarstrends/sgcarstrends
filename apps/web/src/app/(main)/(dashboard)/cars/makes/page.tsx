import type { CarLogo } from "@logos/types";
import { redis } from "@sgcarstrends/utils";
import { MakesDashboard } from "@web/app/(main)/(dashboard)/cars/components/makes";
import { AnimatedSection } from "@web/app/(main)/(dashboard)/components/animated-section";
import { PageHeader } from "@web/components/page-header";
import { MonthSelector } from "@web/components/shared/month-selector";
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
import { createSerializer, type SearchParams } from "nuqs/server";
import { Suspense } from "react";
import type { WebPage, WithContext } from "schema-dts";
import { loadSearchParams, searchParams } from "./search-params";

const serialize = createSerializer(searchParams);

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

const CarMakesPage = async ({ searchParams }: PageProps) => {
  const { make: selectedMakeSlug, month: parsedMonth } =
    await loadSearchParams(searchParams);
  const logos = await redis.get<CarLogo[]>("logos:all");

  const [allMakes, popularMakes, months, lastUpdated] = await Promise.all([
    getDistinctMakes(),
    getPopularMakes(),
    fetchMonthsForCars(),
    redis.get<number>(LAST_UPDATED_CARS_KEY),
  ]);

  const { month, wasAdjusted } = await getMonthOrLatest(parsedMonth, "cars");
  const latestMonth = months[0];

  const makes = allMakes.map(({ make }) => make);
  const popular = popularMakes.map(({ make }) => make);

  let selectedMakeData = null;
  if (selectedMakeSlug) {
    const makeExists = await checkMakeIfExist(selectedMakeSlug);

    if (makeExists) {
      const [makeDetails, coeComparison, logo] = await Promise.all([
        getMakeDetails(selectedMakeSlug, month ?? undefined),
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
      <div className="flex flex-col gap-4">
        <AnimatedSection order={0}>
          <PageHeader
            title="Makes"
            subtitle="List of car makes registered in Singapore."
            lastUpdated={lastUpdated}
          >
            <Suspense fallback={null}>
              <MonthSelector
                months={months}
                latestMonth={latestMonth}
                wasAdjusted={wasAdjusted}
              />
            </Suspense>
          </PageHeader>
        </AnimatedSection>
        <AnimatedSection order={1}>
          <Suspense fallback={null}>
            <MakesDashboard
              makes={makes}
              popularMakes={popular}
              logos={logos}
              selectedMakeData={selectedMakeData}
            />
          </Suspense>
        </AnimatedSection>
      </div>
    </>
  );
};

export default CarMakesPage;
