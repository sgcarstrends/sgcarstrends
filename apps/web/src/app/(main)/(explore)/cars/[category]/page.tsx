import { formatDateToMonthYear } from "@sgcarstrends/utils";
import { loadSearchParams } from "@web/app/(main)/(explore)/cars/search-params";
import { AnimatedSection } from "@web/app/(main)/(explore)/components/animated-section";
import { DashboardPageHeader } from "@web/components/dashboard-page-header";
import { DashboardPageMeta } from "@web/components/dashboard-page-meta";
import { DashboardPageTitle } from "@web/components/dashboard-page-title";
import { MonthSelector } from "@web/components/shared/month-selector";
import { SkeletonCard } from "@web/components/shared/skeleton";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { loadCarsCategoryPageData } from "@web/lib/cars/page-data";
import { loadLastUpdated } from "@web/lib/common";
import { createPageMetadata } from "@web/lib/metadata";
import { fetchMonthsForCars, getMonthOrLatest } from "@web/utils/dates/months";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import type { WebPage, WithContext } from "schema-dts";
import {
  CategoryInsightsCard,
  CategorySummaryCard,
  CategoryTabsPanel,
} from "./components";

interface PageProps {
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
}: PageProps): Promise<Metadata> => {
  const { category } = await params;
  const config = categoryConfigs[category];

  if (!config) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  const { month: parsedMonth } = await loadSearchParams(searchParams);
  const { month } = await getMonthOrLatest(parsedMonth, "cars");
  const formattedMonth = formatDateToMonthYear(month);

  const title = `${formattedMonth} ${config.title} - Car Registrations`;
  const description = config.description.replace("{month}", formattedMonth);

  return createPageMetadata({
    title,
    description,
    canonical: `${config.urlPath}?month=${month}`,
  });
};

const Page = ({ params, searchParams }: PageProps) => (
  <div className="flex flex-col gap-8">
    <DashboardPageHeader
      title={
        <DashboardPageTitle
          title="Category Overview"
          subtitle="Breakdown of registrations by category for the selected month."
        />
      }
      meta={
        <Suspense fallback={<SkeletonCard className="h-10 w-40" />}>
          <CategoryPageHeaderMeta params={params} searchParams={searchParams} />
        </Suspense>
      }
    />

    <Suspense fallback={<SkeletonCard className="h-[720px] w-full" />}>
      <CategoryPageContent params={params} searchParams={searchParams} />
    </Suspense>
  </div>
);

export default Page;

async function CategoryPageHeaderMeta({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ category }, { month: parsedMonth }] = await Promise.all([
    paramsPromise,
    loadSearchParams(searchParamsPromise),
  ]);
  const config = categoryConfigs[category];

  if (!config) {
    return null;
  }

  const [{ wasAdjusted }, months, lastUpdated] = await Promise.all([
    getMonthOrLatest(parsedMonth, "cars"),
    fetchMonthsForCars(),
    loadLastUpdated("cars"),
  ]);

  return (
    <DashboardPageMeta lastUpdated={lastUpdated}>
      <MonthSelector
        months={months}
        latestMonth={months[0]}
        wasAdjusted={wasAdjusted}
      />
    </DashboardPageMeta>
  );
}

async function CategoryPageContent({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ category }, { month: parsedMonth }] = await Promise.all([
    paramsPromise,
    loadSearchParams(searchParamsPromise),
  ]);
  const { month, wasAdjusted } = await getMonthOrLatest(parsedMonth, "cars");
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
      {categoryData.length > 0 ? (
        <>
          <AnimatedSection order={1}>
            <Suspense fallback={<SkeletonCard className="h-[300px] w-full" />}>
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
              </div>
            </Suspense>
          </AnimatedSection>
          <AnimatedSection order={2}>
            <Suspense fallback={<SkeletonCard className="h-[620px] w-full" />}>
              <CategoryTabsPanel
                types={categoryData}
                month={month}
                title={config.tabTitle}
                totalRegistrations={cars.total}
                topMakesByFuelType={topMakesByFuelType}
              />
            </Suspense>
          </AnimatedSection>
        </>
      ) : (
        <div className="py-8 text-center">
          <Typography.Text>
            No {config.title.toLowerCase()} data available for {formattedMonth}
          </Typography.Text>
        </div>
      )}
    </>
  );
}
