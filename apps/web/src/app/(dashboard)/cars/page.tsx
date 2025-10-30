import { redis } from "@sgcarstrends/utils";
import { CategoryTabs } from "@web/app/(dashboard)/cars/category-tabs";
import { loadSearchParams } from "@web/app/(dashboard)/cars/search-params";
import { CarRegistration } from "@web/app/(dashboard)/cars/trends-compare-button";
import { TopMakes } from "@web/components/cars/top-makes";
import { PageHeader } from "@web/components/page-header";
import { MetricCard } from "@web/components/shared/metric-card";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { LAST_UPDATED_CARS_KEY, SITE_TITLE, SITE_URL } from "@web/config";
import {
  getCarsComparison,
  getCarsData,
  getTopMakesByFuelType,
  getTopTypes,
} from "@web/lib/cars/queries";
import { createPageMetadata } from "@web/lib/metadata";
import { generateDatasetSchema } from "@web/lib/structured-data";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import { fetchMonthsForCars, getMonthOrLatest } from "@web/utils/months";
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

  return createPageMetadata({
    title,
    description,
    canonical: `/cars?month=${month}`,
    images,
    keywords: [
      "Singapore car registration",
      "fuel type statistics",
      "vehicle type trends",
      "top car brands Singapore",
      "new car registrations",
      "automotive statistics",
    ],
    includeAuthors: true,
  });
};

const CarsPage = async ({ searchParams }: Props) => {
  let { month } = await loadSearchParams(searchParams);

  month = await getMonthOrLatest(month, "cars");

  const [cars, comparison, topTypes, topMakes, months] = await Promise.all([
    getCarsData(month),
    getCarsComparison(month),
    getTopTypes(month),
    getTopMakesByFuelType(month),
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
              <MetricCard
                title="Total Registrations"
                value={cars.total}
                current={cars.total}
                previousMonth={comparison.previousMonth.total}
              />
              <MetricCard
                title={`Top Fuel Type: ${topTypes.topFuelType.name}`}
                value={topTypes.topFuelType.total}
                current={topTypes.topFuelType.total}
                previousMonth={
                  comparison.previousMonth.fuelType.find(
                    (f) => f.label === topTypes.topFuelType.name,
                  )?.count ?? 0
                }
              />
              <MetricCard
                title={`Top Vehicle Type: ${topTypes.topVehicleType.name}`}
                value={topTypes.topVehicleType.total}
                current={topTypes.topVehicleType.total}
                previousMonth={
                  comparison.previousMonth.vehicleType.find(
                    (v) => v.label === topTypes.topVehicleType.name,
                  )?.count ?? 0
                }
              />
            </div>
            <CategoryTabs cars={cars} />
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
