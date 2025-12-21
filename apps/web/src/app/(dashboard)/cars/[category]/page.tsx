import { loadSearchParams } from "@web/app/(dashboard)/cars/search-params";
import { PageHeader } from "@web/components/page-header";
import { ShareButtons } from "@web/components/share-buttons";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { loadCarsCategoryPageData } from "@web/lib/cars/page-data";
import { createPageMetadata } from "@web/lib/metadata";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import { getMonthOrLatest } from "@web/utils/months";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";
import {
  CategoryInsightsCard,
  CategorySummaryCard,
  CategoryTabsPanel,
} from "./_components";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}

interface CategoryConfig {
  title: string;
  apiDataField: "fuelType" | "vehicleType";
  apiEndpoint: string;
  tabTitle: string;
  description: string;
  urlPath: string;
}

const categoryConfigs: Record<string, CategoryConfig> = {
  "fuel-types": {
    title: "Fuel Types",
    apiDataField: "fuelType",
    apiEndpoint: "fuel-types",
    tabTitle: "Fuel Type",
    description:
      "Comprehensive overview of all fuel types in {month} Singapore car registrations. Compare petrol, diesel, electric, and hybrid vehicle registrations.",
    urlPath: "/cars/fuel-types",
  },
  "vehicle-types": {
    title: "Vehicle Types",
    apiDataField: "vehicleType",
    apiEndpoint: "vehicle-types",
    tabTitle: "Vehicle Type",
    description:
      "Comprehensive overview of all vehicle types in {month} Singapore car registrations. Compare passenger cars, motorcycles, commercial vehicles, and more.",
    urlPath: "/cars/vehicle-types",
  },
};

export const generateStaticParams = async () =>
  Object.keys(categoryConfigs).map((category) => ({ category }));

export const generateMetadata = async ({
  params,
  searchParams,
}: Props): Promise<Metadata> => {
  const { category } = await params;
  const config = categoryConfigs[category];

  if (!config) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  let { month } = await loadSearchParams(searchParams);
  month = await getMonthOrLatest(month, "cars");
  const formattedMonth = formatDateToMonthYear(month);

  const title = `${formattedMonth} ${config.title} - Car Registrations`;
  const description = config.description.replace("{month}", formattedMonth);

  return createPageMetadata({
    title,
    description,
    canonical: `${config.urlPath}?month=${month}`,
  });
};

const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params;
  let { month } = await loadSearchParams(searchParams);
  month = await getMonthOrLatest(month, "cars");

  return <CategoryPageContent category={category} month={month} />;
};

export default Page;

const CategoryPageContent = async ({
  category,
  month,
}: {
  category: string;
  month: string;
}) => {
  const config = categoryConfigs[category];

  if (!config) {
    return notFound();
  }

  const {
    lastUpdated,
    cars,
    marketShare,
    months,
    previousTotal,
    topMakesByFuelType,
  } = await loadCarsCategoryPageData(month, config.apiDataField);

  const categoryData = cars?.[config.apiDataField] || [];

  const formattedMonth = formatDateToMonthYear(month);
  const title = `${formattedMonth} ${config.title} - Car Registrations`;
  const description = config.description.replace("{month}", formattedMonth);

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}${config.urlPath}`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-8">
        <PageHeader
          label="The Breakdown"
          title="What's Popular?"
          lastUpdated={lastUpdated}
          months={months}
          showMonthSelector={true}
        >
          <ShareButtons
            url={`${SITE_URL}${config.urlPath}?month=${month}`}
            title={`${formattedMonth} ${config.title} - ${SITE_TITLE}`}
          />
        </PageHeader>

        {categoryData && categoryData.length > 0 ? (
          <div className="grid grid-cols-12 gap-6">
            <CategorySummaryCard
              total={cars.total}
              previousTotal={previousTotal}
            />
            <CategoryInsightsCard
              categoriesCount={categoryData.length}
              topPerformer={marketShare.dominantType}
              month={month}
              title={config.tabTitle}
            />
            <CategoryTabsPanel
              types={categoryData}
              month={month}
              title={config.tabTitle}
              totalRegistrations={cars.total}
              topMakesByFuelType={topMakesByFuelType}
            />
          </div>
        ) : (
          <div className="py-8 text-center">
            <Typography.Text>
              No {config.title.toLowerCase()} data available for{" "}
              {formattedMonth}
            </Typography.Text>
          </div>
        )}
      </div>
    </>
  );
};
