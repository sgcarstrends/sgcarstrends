import type { CarLogo } from "@logos/types";
import { redis } from "@sgcarstrends/utils";
import { MakeDetail } from "@web/app/(dashboard)/cars/_components/makes";
import { PageHeader } from "@web/components/page-header";
import { ShareButtons } from "@web/components/share-buttons";
import { StructuredData } from "@web/components/structured-data";
import { LAST_UPDATED_CARS_KEY, SITE_TITLE, SITE_URL } from "@web/config";
import { createPageMetadata } from "@web/lib/metadata";
import { createWebPageStructuredData } from "@web/lib/metadata/structured-data";
import { checkMakeIfExist, getMakeDetails } from "@web/queries/cars";
import { getMakeCoeComparison } from "@web/queries/cars/makes/coe-comparison";
import type { Make } from "@web/types";
import { fetchMonthsForCars } from "@web/utils/months";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ make: Make }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
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

export default async function CarMakePage({ params }: PageProps) {
  const { make } = await params;

  const [makeExists, makeDetails, lastUpdated, coeComparison, logo, months] =
    await Promise.all([
      checkMakeIfExist(make),
      getMakeDetails(make),
      redis.get<number>(LAST_UPDATED_CARS_KEY),
      getMakeCoeComparison(make),
      redis.get<CarLogo>(`logo:${make}`),
      fetchMonthsForCars(),
    ]);

  const makeName = makeExists?.make ?? make.toUpperCase();
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
      <div className="flex flex-col gap-4">
        <PageHeader
          title={makeName}
          subtitle={`Historical car registration trends and monthly breakdown for ${makeName} vehicles in Singapore.`}
          lastUpdated={lastUpdated}
          months={months}
        >
          <ShareButtons
            url={`${SITE_URL}/cars/makes/${make}`}
            title={`${makeName} Cars - ${SITE_TITLE}`}
          />
        </PageHeader>

        <MakeDetail cars={cars} coeComparison={coeComparison} />
      </div>
    </>
  );
}
