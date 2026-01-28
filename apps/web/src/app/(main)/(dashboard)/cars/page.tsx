import { CategoryTabs } from "@web/app/(main)/(dashboard)/cars/category-tabs";
import { TopMakes } from "@web/app/(main)/(dashboard)/cars/components/top-makes";
import { loadSearchParams } from "@web/app/(main)/(dashboard)/cars/search-params";
import { TrendsCompareButton } from "@web/app/(main)/(dashboard)/cars/trends-compare-button";
import { PageHeader } from "@web/components/page-header";
import { ShareButtons } from "@web/components/share-buttons";
import { MetricCard } from "@web/components/shared/metric-card";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { loadCarsMetadataData } from "@web/lib/cars/page-data";
import { loadLastUpdated } from "@web/lib/common";
import { createPageMetadata, generateDatasetSchema } from "@web/lib/metadata";
import {
  getCarsComparison,
  getCarsData,
  getTopMakesByFuelType,
  getTopTypes,
} from "@web/queries";
import { fetchMonthsForCars, getMonthOrLatest } from "@web/utils/dates/months";
import { formatDateToMonthYear } from "@web/utils/formatting/format-date-to-month-year";
import { formatVehicleType } from "@web/utils/formatting/format-vehicle-type";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export const generateMetadata = async ({
  searchParams,
}: PageProps): Promise<Metadata> => {
  let { month } = await loadSearchParams(searchParams);

  month = await getMonthOrLatest(month, "cars");

  const formattedMonth = formatDateToMonthYear(month);

  const title = `${formattedMonth} Car Registrations`;
  const description = `Discover ${formattedMonth} car registrations in Singapore. See detailed stats by fuel type, vehicle type, and top brands.`;

  const { topTypes, carRegistration } = await loadCarsMetadataData(month);
  const images = `/api/og?title=Car Registrations&subtitle=Monthly Stats Summary&month=${month}&total=${carRegistration.total}&topFuelType=${topTypes.topFuelType.name}&topVehicleType=${topTypes.topVehicleType.name}`;

  return createPageMetadata({
    title,
    description,
    canonical: `/cars?month=${month}`,
    images,
    includeAuthors: true,
  });
};

// Wrapper: handles nuqs searchParams (runtime data)
const Page = async ({ searchParams }: PageProps) => {
  let { month } = await loadSearchParams(searchParams);
  month = await getMonthOrLatest(month, "cars");
  const months = await fetchMonthsForCars();

  return <CarsPage month={month} months={months} />;
};

export default Page;

const CarsPage = async ({
  month,
  months,
}: {
  month: string;
  months: string[];
}) => {
  const [cars, comparison, topTypes, topMakes] = await Promise.all([
    getCarsData(month),
    getCarsComparison(month),
    getTopTypes(month),
    getTopMakesByFuelType(month),
  ]);

  const lastUpdated = await loadLastUpdated("cars");

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
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Car Registrations"
          subtitle="Monthly new car registrations in Singapore by fuel type and vehicle type."
          lastUpdated={lastUpdated}
          months={months}
          showMonthSelector={true}
        >
          <ShareButtons
            url={`${SITE_URL}/cars?month=${month}`}
            title={`${formattedMonth} Car Registrations - ${SITE_TITLE}`}
          />
        </PageHeader>

        <UnreleasedFeature>
          <TrendsCompareButton />
        </UnreleasedFeature>

        {/*TODO: Improvise*/}
        {!cars && (
          <Typography.H3>
            No data available for the selected period.
          </Typography.H3>
        )}
        {cars && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                title={`Top Vehicle Type: ${formatVehicleType(topTypes.topVehicleType.name)}`}
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
