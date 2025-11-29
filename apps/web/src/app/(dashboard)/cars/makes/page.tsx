import type { CarLogo } from "@logos/types";
import { redis } from "@sgcarstrends/utils";
import { MakesList } from "@web/app/(dashboard)/cars/_components/makes";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import { LAST_UPDATED_CARS_KEY, SITE_TITLE, SITE_URL } from "@web/config";
import { createPageMetadata } from "@web/lib/metadata";
import { getDistinctMakes, getPopularMakes } from "@web/queries/cars";
import { fetchMonthsForCars } from "@web/utils/months";
import type { Metadata } from "next";
import { Suspense } from "react";
import type { WebPage, WithContext } from "schema-dts";

const title = "Makes";
const description =
  "Comprehensive overview of car makes in Singapore. Explore popular brands, discover all available manufacturers, and view registration trends and market statistics.";

export const generateMetadata = async (): Promise<Metadata> => {
  return createPageMetadata({
    title,
    description,
    canonical: "/cars/makes",
  });
};

const CarMakesPage = async () => {
  const logos = await redis.get<CarLogo[]>("logos:all");

  const [allMakes, popularMakes, months, lastUpdated] = await Promise.all([
    getDistinctMakes(),
    getPopularMakes(),
    fetchMonthsForCars(),
    redis.get<number>(LAST_UPDATED_CARS_KEY),
  ]);

  const makes = allMakes.map(({ make }) => make);
  const popular = popularMakes.map(({ make }) => make);

  const title = "Car Makes Overview - Singapore Registration Trends";
  const description =
    "Comprehensive overview of car makes in Singapore. Explore popular brands, discover all available manufacturers, and view registration trends and market statistics.";

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
        <PageHeader
          title="Makes"
          subtitle="List of car makes registered in Singapore."
          lastUpdated={lastUpdated}
          months={months}
        />
        <Suspense fallback={null}>
          <MakesList makes={makes} popularMakes={popular} logos={logos} />
        </Suspense>
      </div>
    </>
  );
};

export default CarMakesPage;
