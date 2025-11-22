import { slugify } from "@sgcarstrends/utils";
import { MakeDetail } from "@web/app/(dashboard)/cars/_components/makes";
import { StructuredData } from "@web/components/structured-data";
import { fetchMakePageData } from "@web/lib/cars/make-data";
import { createPageMetadata } from "@web/lib/metadata";
import { createWebPageStructuredData } from "@web/lib/metadata/structured-data";
import { getDistinctMakes } from "@web/queries/cars";
import { getMakeCoeComparison } from "@web/queries/cars/makes/coe-comparison";
import { getCarLogo } from "@web/queries/logos";
import type { Make } from "@web/types";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";

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
  "use cache";
  cacheLife("max");
  cacheTag("cars");

  const { make } = await params;

  const [{ cars, makes, lastUpdated, makeName }, logo, coeComparison] =
    await Promise.all([
      fetchMakePageData(make),
      getCarLogo(make),
      getMakeCoeComparison(make),
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
        coeComparison={coeComparison}
      />
    </>
  );
};

export default CarMakePage;
