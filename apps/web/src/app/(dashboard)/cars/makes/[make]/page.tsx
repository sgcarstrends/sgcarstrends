"use cache";

import slugify from "@sindresorhus/slugify";
import { getCarLogo } from "@web/actions/logos";
import { MakeDetail } from "@web/app/(dashboard)/cars/_components/makes";
import { StructuredData } from "@web/components/structured-data";
import { fetchMakePageData } from "@web/lib/cars/make-data";
import {
  checkMakeIfExist,
  getDistinctMakes,
  getMakeDetails,
} from "@web/lib/cars/queries";
import { createPageMetadata } from "@web/lib/metadata";
import { createWebPageStructuredData } from "@web/lib/metadata/structured-data";
import type { Make } from "@web/types";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ make: Make }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { make } = await params;

  const [makeExists, makeDetails] = await Promise.all([
    checkMakeIfExist(make),
    getMakeDetails(make),
  ]);

  const makeName = makeExists?.make ?? make.toUpperCase();

  const title = `${makeName} Cars Overview: Registration Trends`;
  const description = `${makeName} cars overview. Historical car registration trends and monthly breakdown by fuel and vehicle types in Singapore.`;

  const images = `/api/og?title=${makeName.toUpperCase()}&subtitle=Stats by Make&total=${makeDetails.total}`;

  return createPageMetadata({
    title,
    description,
    canonical: `/cars/makes/${make}`,
    images,
  });
};

export const generateStaticParams = async () => {
  const allMakes = await getDistinctMakes();
  return allMakes.map(({ make }) => ({ make: slugify(String(make)) }));
};

const CarMakePage = async ({ params }: Props) => {
  const { make } = await params;

  const [{ cars, makes, lastUpdated, makeName }, logo] = await Promise.all([
    fetchMakePageData(make),
    getCarLogo(make),
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
