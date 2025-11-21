import { Badge } from "@sgcarstrends/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@sgcarstrends/ui/components/card";
import { slugify } from "@sgcarstrends/utils";
import { CarOverviewTrends } from "@web/app/(dashboard)/cars/_components/overview-trends";
import { loadSearchParams } from "@web/app/(dashboard)/cars/[category]/[type]/search-params";
import { AnimatedNumber } from "@web/components/animated-number";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { loadCarsTypePageData } from "@web/lib/cars/page-data";
import { createPageMetadata } from "@web/lib/metadata";
import {
  checkFuelTypeIfExist,
  checkVehicleTypeIfExist,
  getDistinctFuelTypes,
  getDistinctVehicleTypes,
} from "@web/queries/cars";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import { getMonthOrLatest } from "@web/utils/months";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

interface Props {
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
}: Props): Promise<Metadata> => {
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

const TypePage = async ({ params, searchParams }: Props) => {
  "use cache";
  cacheLife("max");
  cacheTag("cars");

  const { category, type } = await params;
  let { month } = await loadSearchParams(searchParams);

  const config = categoryConfigs[category as keyof typeof categoryConfigs];
  if (!config) {
    notFound();
  }

  // Validate type parameter
  const typeExists =
    category === "fuel-types"
      ? await checkFuelTypeIfExist(type)
      : await checkVehicleTypeIfExist(type);

  if (!typeExists) {
    notFound();
  }

  month = await getMonthOrLatest(month, "cars");

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
          title={type}
          lastUpdated={lastUpdated}
          months={months}
          showMonthSelector={true}
        />
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Registrations</CardTitle>
                <Badge>{formattedMonth}</Badge>
              </CardHeader>
              <CardContent className="font-bold text-4xl text-primary">
                <AnimatedNumber value={cars.total} />
              </CardContent>
            </Card>
          </div>
        </div>
        <CarOverviewTrends cars={cars.data} total={cars.total} />
      </div>
    </>
  );
};

export default TypePage;
