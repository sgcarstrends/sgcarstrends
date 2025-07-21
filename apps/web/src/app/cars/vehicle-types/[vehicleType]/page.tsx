import slugify from "@sindresorhus/slugify";
import { type SearchParams } from "nuqs/server";
import { loadSearchParams } from "@/app/cars/vehicle-types/[vehicleType]/search-params";
import { AnimatedNumber } from "@/components/animated-number";
import { CarOverviewTrends } from "@/components/car-overview-trends";
import { PageHeader } from "@/components/page-header";
import { StructuredData } from "@/components/structured-data";
import Typography from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL, LAST_UPDATED_CARS_KEY, SITE_TITLE, SITE_URL } from "@/config";
import redis from "@/config/redis";
import { type LatestMonth, type Month, RevalidateTags } from "@/types";
import { fetchApi } from "@/utils/fetch-api";
import { formatDateToMonthYear } from "@/utils/format-date-to-month-year";
import { fetchMonthsForCars, getMonthOrLatest } from "@/utils/month-utils";
import { deslugify } from "@/utils/slugify";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";

interface Props {
  params: Promise<{ vehicleType: string }>;
  searchParams: Promise<SearchParams>;
}

interface VehicleType {
  total: number;
  data: {
    month: string;
    make: string;
    vehicleType: string;
    count: number;
  }[];
}

export const generateMetadata = async ({
  params,
  searchParams,
}: Props): Promise<Metadata> => {
  const { vehicleType } = await params;
  const { month } = await loadSearchParams(searchParams);

  const formattedVehicleType = deslugify(vehicleType);
  const title = `${formattedVehicleType} Cars in Singapore`;
  const description = `${formattedVehicleType} cars registrations by month. Explore registration trends, statistics and distribution by vehicle type for the month in Singapore.`;
  // const images = `/api/og?title=Historical Trend&type=${vehicleType}`;
  const canonical = `/cars/vehicle-types/${vehicleType}?month=${month}`;

  return {
    title,
    description,
    openGraph: {
      images: `${SITE_URL}/opengraph-image.png`,
      url: canonical,
      siteName: SITE_TITLE,
      locale: "en_SG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
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
  const vehicleTypes = await fetchApi<string[]>(
    `${API_URL}/cars/vehicle-types`,
  );
  return vehicleTypes.map((vehicleType) => ({
    vehicleType: slugify(vehicleType),
  }));
};

const CarsByVehicleTypePage = async ({ params, searchParams }: Props) => {
  const { vehicleType } = await params;
  let { month } = await loadSearchParams(searchParams);

  month = await getMonthOrLatest(month, "cars");

  const [cars, months] = await Promise.all([
    fetchApi<VehicleType>(
      `${API_URL}/cars/vehicle-types/${vehicleType}?month=${month}`,
    ),
    fetchMonthsForCars(),
  ]);
  const lastUpdated = await redis.get<number>(LAST_UPDATED_CARS_KEY);

  const formattedVehicleType = deslugify(vehicleType);

  const formattedMonth = formatDateToMonthYear(month);

  const title = `${formattedVehicleType} Cars in Singapore`;
  const description = `${formattedVehicleType} cars registrations by month. Explore registration trends, statistics and distribution by vehicle type for the month in Singapore.`;
  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/cars/vehicle-types/${vehicleType}`,
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
          title={deslugify(vehicleType)}
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

export default CarsByVehicleTypePage;
