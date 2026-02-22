import { formatDateToMonthYear } from "@sgcarstrends/utils";
import {
  type CategoryConfig,
  CategoryPage,
} from "@web/app/(main)/(explore)/cars/components/category";
import { loadSearchParams } from "@web/app/(main)/(explore)/cars/search-params";
import { createPageMetadata } from "@web/lib/metadata";
import { getMonthOrLatest } from "@web/utils/dates/months";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

const config: CategoryConfig = {
  title: "Vehicle Types",
  apiDataField: "vehicleType",
  tabTitle: "Vehicle Type",
  description:
    "Comprehensive overview of all vehicle types in {month} Singapore car registrations. Compare passenger cars, motorcycles, commercial vehicles, and more.",
  urlPath: "/cars/vehicle-types",
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
  return <CategoryPage config={config} searchParams={searchParams} />;
}
