import { formatDateToMonthYear } from "@sgcarstrends/utils";
import {
  type CategoryConfig,
  CategoryOverview,
} from "@web/app/(main)/(explore)/cars/components/category/category-overview";
import { loadSearchParams } from "@web/app/(main)/(explore)/cars/registrations/search-params";
import { createPageMetadata } from "@web/lib/metadata";
import { getMonthOrLatest } from "@web/utils/dates/months";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

const config: CategoryConfig = {
  title: "Fuel Types",
  apiDataField: "fuelType",
  tabTitle: "Fuel Type",
  description:
    "Comprehensive overview of all fuel types in {month} Singapore car registrations. Compare petrol, diesel, electric, and hybrid vehicle registrations.",
  urlPath: "/cars/fuel-types",
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
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
}

export default function Page({ searchParams }: PageProps) {
  return <CategoryOverview config={config} searchParams={searchParams} />;
}
