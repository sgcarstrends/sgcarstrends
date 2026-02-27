import {
  type CategoryConfig,
  CategoryOverview,
  generateCategoryMetadata,
} from "@web/app/(main)/(explore)/cars/components/category/category-overview";
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

export async function generateMetadata({ searchParams }: PageProps) {
  return generateCategoryMetadata(config, searchParams);
}

export default function Page({ searchParams }: PageProps) {
  return <CategoryOverview config={config} searchParams={searchParams} />;
}
