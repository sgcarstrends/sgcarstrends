import type { CarLogo } from "@logos/types";
import { redis, slugify } from "@sgcarstrends/utils";
import { MakeDetail } from "@web/app/(dashboard)/cars/_components/makes";
import { StructuredData } from "@web/components/structured-data";
import { LAST_UPDATED_CARS_KEY } from "@web/config";
import { createPageMetadata } from "@web/lib/metadata";
import { createWebPageStructuredData } from "@web/lib/metadata/structured-data";
import {
  checkMakeIfExist,
  getDistinctMakes,
  getMakeDetails,
} from "@web/queries/cars";
import { getMakeCoeComparison } from "@web/queries/cars/makes/coe-comparison";
import type { Make } from "@web/types";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ make: Make }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { make } = await params;

  const makeName = make.toUpperCase().replaceAll("-", " ");

  const title = `${makeName} Cars Overview: Registration Trends`;
  const description = `${makeName} cars overview. Historical car registration trends and monthly breakdown by fuel and vehicle types in Singapore.`;

  const images = `/api/og?title=${makeName}&subtitle=Stats by Make`;

  return createPageMetadata({
    title,
    description,
    canonical: `/cars/makes/${make}`,
    images,
  });
};

export const generateStaticParams = async () => {
  const allMakes = await getDistinctMakes();
  return allMakes.map(({ make }) => ({ make: slugify(make) }));
};

const CarMakePage = async ({ params }: Props) => {
  const { make } = await params;

  const [
    makeExists,
    makeDetails,
    makesResult,
    lastUpdated,
    coeComparison,
    logo,
  ] = await Promise.all([
    checkMakeIfExist(make),
    getMakeDetails(make),
    getDistinctMakes(),
    redis.get<number>(LAST_UPDATED_CARS_KEY),
    getMakeCoeComparison(make),
    redis.get<CarLogo>(`logo:${make}`),
  ]);

  const makeName = makeExists?.make ?? make.toUpperCase();
  const makes = makesResult.map(({ make }) => make);
  const cars = {
    make: makeName,
    total: makeDetails.total,
    data: makeDetails.data,
  };

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
        coeComparison={coeComparison}
      />
    </>
  );
};

export default CarMakePage;
