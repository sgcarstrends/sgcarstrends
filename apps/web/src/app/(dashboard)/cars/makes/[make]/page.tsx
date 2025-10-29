import { redis } from "@sgcarstrends/utils";
import slugify from "@sindresorhus/slugify";
import { loadSearchParams } from "@web/app/(dashboard)/cars/makes/[make]/search-params";
import { MakeDetail } from "@web/components/cars/makes";
import { StructuredData } from "@web/components/structured-data";
import { LAST_UPDATED_CARS_KEY, SITE_TITLE, SITE_URL } from "@web/config";
import {
  checkMakeIfExist,
  getDistinctMakes,
  getMakeDetails,
} from "@web/lib/data/cars";
import type { Car, Make } from "@web/types";
import { getMonthOrLatest } from "@web/utils/months";
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

  const [makeExists, makeDetails] = await Promise.all([
    checkMakeIfExist(make),
    getMakeDetails(make, month),
  ]);

  const makeName = makeExists?.make ?? make.toUpperCase();

  const title = `${makeName} Cars Overview: Registration Trends`;
  const description = `${makeName} cars overview. Historical car registration trends and monthly breakdown by fuel and vehicle types in Singapore.`;

  const images = `/api/og?title=${makeName.toUpperCase()}&subtitle=Stats by Make&month=${month}&total=${makeDetails.total}`;
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
  const makesResult = await getDistinctMakes();
  await fetch(`https://car-logos.sgcarstrends.workers.dev/logos/sync`);
  return makesResult.map((m) => ({ make: slugify(m.make) }));
};

const CarMakePage = async ({ params }: Props) => {
  const { make } = await params;

  const getLogo = (): Promise<Logo> =>
    fetch(`https://car-logos.sgcarstrends.workers.dev/logos/${slugify(make)}`)
      .then((res) => res.json())
      .then((data) => data.logo)
      .catch((e) => console.error(e));

  const [makeExists, makeDetails, makesResult, logo, lastUpdated] =
    await Promise.all([
      checkMakeIfExist(make),
      getMakeDetails(make),
      getDistinctMakes(),
      getLogo(),
      redis.get<number>(LAST_UPDATED_CARS_KEY),
    ]);

  const makeName = makeExists?.make ?? make.toUpperCase();
  const makes = makesResult.map((m) => m.make);

  // Transform makeDetails to match expected cars format
  const cars = {
    make: makeName,
    total: makeDetails.total,
    data: makeDetails.data.map(
      (d): Car => ({
        month: d.month,
        make: makeName,
        fuel_type: d.fuelType as Car["fuel_type"],
        vehicle_type: d.vehicleType as Car["vehicle_type"],
        number: d.count,
      }),
    ),
  };

  const title = `${makeName} Cars Overview: Registration Trends`;
  const description = `${makeName} cars overview. Historical car registration trends and monthly breakdown by fuel and vehicle types in Singapore.`;
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
