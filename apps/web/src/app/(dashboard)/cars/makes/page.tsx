import { redis } from "@sgcarstrends/utils";
import { getPopularMakes } from "@web/actions";
import { MakesList } from "@web/components/makes";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import {
  API_URL,
  LAST_UPDATED_CARS_KEY,
  SITE_TITLE,
  SITE_URL,
} from "@web/config";
import type { Make } from "@web/types";
import { fetchApi } from "@web/utils/fetch-api";
import { fetchMonthsForCars } from "@web/utils/month-utils";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";

export const generateMetadata = async (): Promise<Metadata> => {
  const title = "Makes";
  const description =
    "Comprehensive overview of car makes in Singapore. Explore popular brands, discover all available manufacturers, and view registration trends and market statistics.";

  const canonical = `/cars/makes`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_TITLE,
      locale: "en_SG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@sgcarstrends",
      creator: "@sgcarstrends",
    },
    alternates: {
      canonical,
    },
  };
};

const CarMakesPage = async () => {
  const [makes, popularMakes, months, lastUpdated] = await Promise.all([
    fetchApi<Make[]>(`${API_URL}/cars/makes`),
    getPopularMakes(),
    fetchMonthsForCars(),
    redis.get<number>(LAST_UPDATED_CARS_KEY),
  ]);

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
        <MakesList makes={makes} popularMakes={popularMakes} />
      </div>
    </>
  );
};

export default CarMakesPage;
