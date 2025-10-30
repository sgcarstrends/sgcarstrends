import slugify from "@sindresorhus/slugify";
import { MakeDetail } from "@web/app/(dashboard)/cars/_components/makes";
import { loadSearchParams } from "@web/app/(dashboard)/cars/makes/[make]/search-params";
import { StructuredData } from "@web/components/structured-data";
import { fetchMakePageData } from "@web/lib/cars/make-data";
import {
  checkMakeIfExist,
  getDistinctMakes,
  getMakeDetails,
} from "@web/lib/cars/queries";
import { createPageMetadata } from "@web/lib/metadata";
import { createWebPageStructuredData } from "@web/lib/metadata/structured-data";
import { getMonthOrLatest } from "@web/utils/months";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

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

  return createPageMetadata({
    title,
    description,
    canonical: `/cars/makes/${make}?month=${month}`,
    images,
  });
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

  const [{ cars, makes, lastUpdated, makeName }, logo] = await Promise.all([
    fetchMakePageData(make),
    getLogo(),
  ]);

  const title = `${makeName} Cars Overview: Registration Trends`;
  const description = `${makeName} cars overview. Historical car registration trends and monthly breakdown by fuel and vehicle types in Singapore.`;
  const structuredData = createWebPageStructuredData(
    title,
    description,
    `/cars/makes/${make}`,
  );

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
