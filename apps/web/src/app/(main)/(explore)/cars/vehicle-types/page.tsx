import {
  type CategoryConfig,
  CategoryOverview,
  generateCategoryMetadata,
} from "@web/app/(main)/(explore)/cars/components/category/category-overview";
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

export async function generateMetadata({ searchParams }: PageProps) {
  return generateCategoryMetadata(config, searchParams);
}

export default function Page({ searchParams }: PageProps) {
  return <CategoryOverview config={config} searchParams={searchParams} />;
}
