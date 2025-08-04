import { CarRegistration } from "@web/app/cars/car-registration";
import { loadSearchParams } from "@web/app/cars/search-params";
import { AnimatedNumber } from "@web/components/animated-number";
import { MetricsComparison } from "@web/components/metrics-comparison";
import { PageHeader } from "@web/components/page-header";
import { StatCard } from "@web/components/stat-card";
import { StructuredData } from "@web/components/structured-data";
import { TopMakes } from "@web/components/top-makes";
import Typography from "@web/components/typography";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { LAST_UPDATED_CARS_KEY, SITE_TITLE, SITE_URL } from "@web/config";
import redis from "@web/config/redis";
import { generateDatasetSchema } from "@web/lib/structured-data";
import {
  getCarsComparison,
  getCarsData,
  getTopMakes,
  getTopTypes,
} from "@web/utils/cached-api";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import { fetchMonthsForCars, getMonthOrLatest } from "@web/utils/month-utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

interface Props {
  searchParams: Promise<SearchParams>;
}

// Enable ISR with 1-hour revalidation
export const revalidate = 3600;

export const generateMetadata = async ({
  searchParams,
}: Props): Promise<Metadata> => {
  let { month } = await loadSearchParams(searchParams);

  month = await getMonthOrLatest(month, "cars");

  const formattedMonth = formatDateToMonthYear(month);

  const title = `${formattedMonth} Car Registrations`;
  const description = `Discover ${formattedMonth} car registrations in Singapore. See detailed stats by fuel type, vehicle type, and top brands.`;

  const [topTypes, carRegistration] = await Promise.all([
    getTopTypes(month),
    getCarsData(month),
  ]);
  const images = `/api/og?title=Car Registrations&subtitle=Monthly Stats Summary&month=${month}&total=${carRegistration.total}&topFuelType=${topTypes.topFuelType.name}&topVehicleType=${topTypes.topVehicleType.name}`;

  const canonical = `/cars?month=${month}`;

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

const CarsPage = async ({ searchParams }: Props) => {
  let { month } = await loadSearchParams(searchParams);

  month = await getMonthOrLatest(month, "cars");

  const [cars, comparison, topTypes, topMakes, months] = await Promise.all([
    getCarsData(month),
    getCarsComparison(month),
    getTopTypes(month),
    getTopMakes(month),
    fetchMonthsForCars(),
  ]);

  const lastUpdated = await redis.get<number>(LAST_UPDATED_CARS_KEY);

  if (!cars) {
    return notFound();
  }

  const formattedMonth = formatDateToMonthYear(month);

  const title = `${formattedMonth} Car Registrations`;
  const description = `Discover ${formattedMonth} car registrations in Singapore. See detailed stats by fuel type, vehicle type, and top brands.`;
  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/cars`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <StructuredData
        data={{ "@context": "https://schema.org", ...generateDatasetSchema() }}
      />
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Car Registrations"
          lastUpdated={lastUpdated}
          months={months}
          showMonthSelector={true}
        />

        <UnreleasedFeature>
          <CarRegistration />
        </UnreleasedFeature>

        {/*TODO: Improvise*/}
        {!cars && (
          <Typography.H3>
            No data available for the selected period.
          </Typography.H3>
        )}
        {cars && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Card className="bg-gradient-to-tr from-primary-600 to-primary text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Total Registrations
                  </CardTitle>
                </CardHeader>
                <CardContent className="font-bold text-2xl">
                  <AnimatedNumber value={cars.total} />
                </CardContent>
                <CardFooter>
                  <MetricsComparison
                    current={cars.total}
                    previousMonth={comparison.previousMonth.total}
                  />
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Top Fuel Type: {topTypes.topFuelType.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="font-bold text-2xl text-primary">
                  <AnimatedNumber value={topTypes.topFuelType.total} />
                </CardContent>
                <CardFooter>
                  <MetricsComparison
                    current={topTypes.topFuelType.total}
                    previousMonth={
                      comparison.previousMonth.fuelType.find(
                        (f) => f.label === topTypes.topFuelType.name,
                      )?.count ?? 0
                    }
                  />
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Top Vehicle Type: {topTypes.topVehicleType.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="font-bold text-2xl text-primary">
                  <AnimatedNumber value={topTypes.topVehicleType.total} />
                </CardContent>
                <CardFooter>
                  <MetricsComparison
                    current={topTypes.topVehicleType.total}
                    previousMonth={
                      comparison.previousMonth.vehicleType.find(
                        (v) => v.label === topTypes.topVehicleType.name,
                      )?.count ?? 0
                    }
                  />
                </CardFooter>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <StatCard
                title="By Fuel Type"
                description="Distribution of vehicles based on fuel type"
                data={cars.fuelType}
                total={cars.total}
                linkPrefix="fuel-types"
              />
              <StatCard
                title="By Vehicle Type"
                description="Distribution of vehicles based on vehicle type"
                data={cars.vehicleType}
                total={cars.total}
                linkPrefix="vehicle-types"
              />
            </div>
            <div className="flex items-center justify-between">
              <Typography.H2>Top Makes by Fuel Type</Typography.H2>
            </div>
            <TopMakes data={topMakes} />
          </div>
        )}
      </div>
    </>
  );
};

export default CarsPage;
