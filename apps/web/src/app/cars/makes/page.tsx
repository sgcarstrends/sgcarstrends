import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";
import { loadSearchParams } from "@/app/cars/search-params";
import { BetaChip } from "@/components/chips";
import { PageHeader } from "@/components/page-header";
import { StructuredData } from "@/components/structured-data";
import { API_URL, LAST_UPDATED_CARS_KEY, SITE_TITLE, SITE_URL } from "@/config";
import redis from "@/config/redis";
import type { Make } from "@/types";
import { fetchApi } from "@/utils/fetch-api";
import { fetchMonthsForCars, getMonthOrLatest } from "@/utils/month-utils";
import { MakesList } from "./makes-list";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const generateMetadata = async ({
  searchParams,
}: Props): Promise<Metadata> => {
  let { month } = await loadSearchParams(searchParams);
  month = await getMonthOrLatest(month, "cars");

  const title = "Makes";
  const description =
    "Comprehensive overview of car makes in Singapore. Explore popular brands, discover all available manufacturers, and view registration trends and market statistics.";

  const canonical = `/cars/makes?month=${month}`;

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

const CarMakesPage = async ({ searchParams }: Props) => {
  let { month } = await loadSearchParams(searchParams);
  month = await getMonthOrLatest(month, "cars");

  const [makes, months, lastUpdated] = await Promise.all([
    fetchApi<Make[]>(`${API_URL}/cars/makes`),
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
        <BetaChip />
        <PageHeader
          title="Makes"
          subtitle="List of car makes registered in Singapore."
          lastUpdated={lastUpdated}
          months={months}
        />
        <MakesList makes={makes} />
      </div>
    </>
  );
};

export default CarMakesPage;
