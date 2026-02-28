import { slugify } from "@sgcarstrends/utils";
import {
  generateTypeDetailMetadata,
  TypeDetail,
  type TypeDetailConfig,
} from "@web/app/(main)/(explore)/cars/components/category/type-detail";
import { getDistinctFuelTypes } from "@web/queries/cars";
import type { SearchParams } from "nuqs/server";

const config: TypeDetailConfig = {
  category: "fuel-types",
  description:
    "cars registrations by month. Explore registration trends, statistics and distribution by fuel type for the month in Singapore.",
};

interface PageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  return generateTypeDetailMetadata(config, params, searchParams);
}

export async function generateStaticParams() {
  const fuelTypes = await getDistinctFuelTypes();
  return fuelTypes.map(({ fuelType }) => ({ type: slugify(fuelType) }));
}

export default function Page({ params, searchParams }: PageProps) {
  return (
    <TypeDetail config={config} params={params} searchParams={searchParams} />
  );
}
