import { loadSearchParams } from "@web/app/cars/search-params";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import {
  API_URL,
  LAST_UPDATED_CARS_KEY,
  SITE_TITLE,
  SITE_URL,
} from "@web/config";
import redis from "@web/config/redis";
import {
  getCarMarketShareData,
  getCarTopPerformersData,
} from "@web/utils/api/cars";
import { fetchApi } from "@web/utils/fetch-api";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import { fetchMonthsForCars, getMonthOrLatest } from "@web/utils/month-utils";
import { CategoryTypesTabsView } from "./category-tabs";
import type { CategoryData } from "@web/types";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

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

  const canonical = `${config.urlPath}?month=${month}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_TITLE,
      locale: "en_SG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@sgcarstrends",
      creator: "@sgcarstrends",
    },
    alternates: {
      canonical,
    },
  };
};

const CategoryPage = async ({ params, searchParams }: Props) => {
  const { category } = await params;
  const config = categoryConfigs[category];

  if (!config) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Category not found</p>
      </div>
    );
  }

  let { month } = await loadSearchParams(searchParams);
  month = await getMonthOrLatest(month, "cars");

  const getCars = fetchApi<CategoryData>(`${API_URL}/cars?month=${month}`);
  const months = await fetchMonthsForCars();

  const [lastUpdated, cars, topPerformers, marketShare] = await Promise.all([
    redis.get<number>(LAST_UPDATED_CARS_KEY),
    getCars,
    getCarTopPerformersData(month),
    getCarMarketShareData(month, config.apiDataField),
  ]);

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
      <div className="flex flex-col gap-4">
        <PageHeader
          title={config.title}
          lastUpdated={lastUpdated}
          months={months}
          showMonthSelector={true}
        />

        {categoryData && categoryData.length > 0 ? (
          <CategoryTypesTabsView
            types={categoryData}
            month={month}
            category={config.apiEndpoint}
            title={config.tabTitle}
            topPerformers={topPerformers}
            marketShare={marketShare}
            totalRegistrations={cars.total}
          />
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              No {config.title.toLowerCase()} data available for{" "}
              {formattedMonth}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
