import { redis } from "@sgcarstrends/utils";
import slugify from "@sindresorhus/slugify";
import { loadSearchParams } from "@web/app/(dashboard)/cars/makes/[make]/search-params";
import { MakeDetail } from "@web/components/makes";
import { StructuredData } from "@web/components/structured-data";
import {
  API_URL,
  LAST_UPDATED_CARS_KEY,
  SITE_TITLE,
  SITE_URL,
} from "@web/config";
import type { Car, Make } from "@web/types";
import { fetchApi } from "@web/utils/fetch-api";
import { getMonthOrLatest } from "@web/utils/month-utils";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

interface Props {
  params: Promise<{ make: string }>;
  searchParams: Promise<SearchParams>;
}

// TODO: Interim fix
export type Logo = {
  brand: string;
  filename: string;
  url: string;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: Props): Promise<Metadata> => {
  const { make } = await params;
  let { month } = await loadSearchParams(searchParams);

  month = await getMonthOrLatest(month, "cars");

  const cars = await fetchApi<{ make: string; total: number; data: Car[] }>(
    `${API_URL}/cars/makes/${make}?month=${month}`,
  );

  const title = `${cars.make} Cars Overview: Registration Trends`;
  const description = `${cars.make} cars overview. Historical car registration trends and monthly breakdown by fuel and vehicle types in Singapore.`;

  const images = `/api/og?title=${make.toUpperCase()}&subtitle=Stats by Make&month=${month}&total=${cars.total}`;
  const canonical = `/cars/makes/${make}?month=${month}`;

  return {
    title,
    description,
    openGraph: {
      images,
      url: canonical,
      siteName: SITE_TITLE,
      locale: "en_SG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      images,
      site: "@sgcarstrends",
      creator: "@sgcarstrends",
    },
    alternates: {
      canonical,
    },
  };
};

export const generateStaticParams = async () => {
  const makes = await fetchApi<Make[]>(`${API_URL}/cars/makes`);
  await fetch(`https://car-logos.sgcarstrends.workers.dev/logos/sync`);
  return makes.map((make) => ({ make: slugify(make) }));
};

const CarMakePage = async ({ params }: Props) => {
  const { make } = await params;

  const getLogo = (): Promise<Logo> =>
    fetch(`https://car-logos.sgcarstrends.workers.dev/logos/${slugify(make)}`)
      .then((res) => res.json())
      .then((data) => data.logo)
      .catch((e) => console.error(e));

  const [cars, makes, logo]: [
    { make: string; total: number; data: Car[] },
    Make[],
    Logo,
  ] = await Promise.all([
    fetchApi<{ make: string; total: number; data: Car[] }>(
      `${API_URL}/cars/makes/${slugify(make)}`,
    ),
    fetchApi<Make[]>(`${API_URL}/cars/makes`),
    getLogo(),
  ]);
  const lastUpdated = await redis.get<number>(LAST_UPDATED_CARS_KEY);

  const title = `${cars.make} Cars Overview: Registration Trends`;
  const description = `${cars.make} cars overview. Historical car registration trends and monthly breakdown by fuel and vehicle types in Singapore.`;
  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/cars/makes/${make}`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <MakeDetail
        make={make}
        cars={cars}
        makes={makes}
        lastUpdated={lastUpdated}
        logo={logo}
      />
    </>
  );
};

export default CarMakePage;
