import slugify from "@sindresorhus/slugify";
import { loadSearchParams } from "@web/app/cars/[category]/[type]/search-params";
import { AnimatedNumber } from "@web/components/animated-number";
import { CarOverviewTrends } from "@web/components/car-overview-trends";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import { Badge } from "@web/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import {
  API_URL,
  LAST_UPDATED_CARS_KEY,
  SITE_TITLE,
  SITE_URL,
} from "@web/config";
import redis from "@web/config/redis";
import { fetchApi } from "@web/utils/fetch-api";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import { fetchMonthsForCars, getMonthOrLatest } from "@web/utils/month-utils";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

interface Props {
  params: Promise<{ category: string; type: string }>;
  searchParams: Promise<SearchParams>;
}

interface TypeData {
  total: number;
  data: {
    month: string;
    make: string;
    fuelType?: string;
    vehicleType?: string;
    count: number;
  }[];
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
  const canonical = `/cars/${category}/${type}?month=${month}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: `${SITE_URL}/opengraph-image.png`,
      url: canonical,
      siteName: SITE_TITLE,
      locale: "en_SG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: `${SITE_URL}/twitter-image.png`,
      site: "@sgcarstrends",
      creator: "@sgcarstrends",
    },
    alternates: {
      canonical,
    },
  };
};

export const generateStaticParams = async () => {
  const [fuelTypes, vehicleTypes] = await Promise.all([
    fetchApi<string[]>(`${API_URL}/cars/fuel-types`),
    fetchApi<string[]>(`${API_URL}/cars/vehicle-types`),
  ]);

  const params: { category: string; type: string }[] = [];

  // Add fuel-types params
  fuelTypes.forEach((fuelType) => {
    params.push({
      category: "fuel-types",
      type: slugify(fuelType),
    });
  });

  // Add vehicle-types params
  vehicleTypes.forEach((vehicleType) => {
    params.push({
      category: "vehicle-types",
      type: slugify(vehicleType),
    });
  });

  return params;
};

const TypePage = async ({ params, searchParams }: Props) => {
  const { category, type } = await params;
  let { month } = await loadSearchParams(searchParams);

  const config = categoryConfigs[category as keyof typeof categoryConfigs];
  if (!config) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Category not found</p>
      </div>
    );
  }

  month = await getMonthOrLatest(month, "cars");

  const [cars, months] = await Promise.all([
    fetchApi<TypeData>(`${API_URL}/cars/${category}/${type}?month=${month}`),
    fetchMonthsForCars(),
  ]);
  const lastUpdated = await redis.get<number>(LAST_UPDATED_CARS_KEY);

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
              <CardContent className="text-primary text-4xl font-bold">
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
