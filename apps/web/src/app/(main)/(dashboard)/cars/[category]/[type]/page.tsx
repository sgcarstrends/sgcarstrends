import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { slugify } from "@sgcarstrends/utils";
import { loadSearchParams } from "@web/app/(main)/(dashboard)/cars/[category]/[type]/search-params";
import { CarOverviewTrends } from "@web/app/(main)/(dashboard)/cars/components/overview-trends";
import { AnimatedNumber } from "@web/components/animated-number";
import { PageHeader } from "@web/components/page-header";
import { ShareButtons } from "@web/components/share-buttons";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { loadCarsTypePageData } from "@web/lib/cars/page-data";
import { createPageMetadata } from "@web/lib/metadata";
import {
  checkFuelTypeIfExist,
  checkVehicleTypeIfExist,
  getDistinctFuelTypes,
  getDistinctVehicleTypes,
} from "@web/queries/cars";
import { getMonthOrLatest } from "@web/utils/dates/months";
import { formatDateToMonthYear } from "@web/utils/formatting/format-date-to-month-year";
import { formatVehicleTypeSlug } from "@web/utils/formatting/format-vehicle-type";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

interface PageProps {
  params: Promise<{ category: string; type: string }>;
  searchParams: Promise<SearchParams>;
}

const categoryConfigs = {
  "fuel-types": {
    description:
      "cars registrations by month. Explore registration trends, statistics and distribution by fuel type for the month in Singapore.",
  },
  "vehicle-types": {
    description:
      "cars registrations by month. Explore registration trends, statistics and distribution by vehicle type for the month in Singapore.",
  },
} as const;

export const generateMetadata = async ({
  params,
  searchParams,
}: PageProps): Promise<Metadata> => {
  const { category, type } = await params;
  const { month } = await loadSearchParams(searchParams);

  const config = categoryConfigs[category as keyof typeof categoryConfigs];
  if (!config) {
    return {
      title: "Not Found",
      description: "The requested page could not be found.",
    };
  }

  const title = "Cars in Singapore";
  const description = config.description;

  return createPageMetadata({
    title,
    description,
    canonical: `/cars/${category}/${type}?month=${month}`,
    images: `${SITE_URL}/opengraph-image.png`,
  });
};

export const generateStaticParams = async () => {
  const [fuelTypesResult, vehicleTypesResult] = await Promise.all([
    getDistinctFuelTypes(),
    getDistinctVehicleTypes(),
  ]);

  const params: { category: string; type: string }[] = [];

  // Add fuel-types params
  fuelTypesResult.forEach(({ fuelType }) => {
    params.push({
      category: "fuel-types",
      type: slugify(fuelType),
    });
  });

  // Add vehicle-types params
  vehicleTypesResult.forEach(({ vehicleType }) => {
    params.push({
      category: "vehicle-types",
      type: slugify(vehicleType),
    });
  });

  return params;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { category, type } = await params;
  const { month: parsedMonth } = await loadSearchParams(searchParams);
  const { month, wasAdjusted } = await getMonthOrLatest(parsedMonth, "cars");

  const config = categoryConfigs[category as keyof typeof categoryConfigs];
  if (!config) {
    notFound();
  }

  const typeExists =
    category === "fuel-types"
      ? await checkFuelTypeIfExist(type)
      : await checkVehicleTypeIfExist(type);

  if (!typeExists) {
    notFound();
  }

  const { cars, months, lastUpdated } = await loadCarsTypePageData(
    category,
    type,
    month,
  );

  const formattedMonth = formatDateToMonthYear(month);

  const title = "Cars in Singapore";
  const description = config.description;

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/cars/${category}/${type}`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-4">
        <PageHeader
          title={
            category === "vehicle-types" ? formatVehicleTypeSlug(type) : type
          }
          subtitle={`Registration trends for ${category === "vehicle-types" ? formatVehicleTypeSlug(type) : type} vehicles in Singapore.`}
          lastUpdated={lastUpdated}
          months={months}
          latestMonth={months[0]}
          wasAdjusted={wasAdjusted}
          showMonthSelector={true}
        >
          <ShareButtons
            url={`${SITE_URL}/cars/${category}/${type}?month=${month}`}
            title={`${category === "vehicle-types" ? formatVehicleTypeSlug(type) : type} - ${formattedMonth} - ${SITE_TITLE}`}
          />
        </PageHeader>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="rounded-2xl p-3">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <Typography.H4>Registrations</Typography.H4>
                <Chip size="sm" variant="flat">
                  {formattedMonth}
                </Chip>
              </CardHeader>
              <CardBody className="font-bold text-4xl text-primary">
                <AnimatedNumber value={cars.total} />
              </CardBody>
            </Card>
          </div>
        </div>
        <CarOverviewTrends cars={cars.data} total={cars.total} />
      </div>
    </>
  );
}
