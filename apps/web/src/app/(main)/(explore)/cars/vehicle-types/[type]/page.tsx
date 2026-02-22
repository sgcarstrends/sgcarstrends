import { slugify } from "@sgcarstrends/utils";
import {
  TypeDetail,
  type TypeDetailConfig,
} from "@web/app/(main)/(explore)/cars/components/category/type-detail";
import { SITE_URL } from "@web/config";
import { createPageMetadata } from "@web/lib/metadata";
import { getDistinctVehicleTypes } from "@web/queries/cars";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { createLoader, parseAsString } from "nuqs/server";

const typeSearchParams = { month: parseAsString };
const loadSearchParams = createLoader(typeSearchParams);

const config: TypeDetailConfig = {
  category: "vehicle-types",
  description:
    "cars registrations by month. Explore registration trends, statistics and distribution by vehicle type for the month in Singapore.",
};

interface PageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { type } = await params;
  const { month } = await loadSearchParams(searchParams);

  return createPageMetadata({
    title: "Cars in Singapore",
    description: config.description,
    canonical: `/cars/vehicle-types/${type}?month=${month}`,
    images: `${SITE_URL}/opengraph-image.png`,
  });
}

export async function generateStaticParams() {
  const vehicleTypes = await getDistinctVehicleTypes();
  return vehicleTypes.map(({ vehicleType }) => ({
    type: slugify(vehicleType),
  }));
}

export default function Page({ params, searchParams }: PageProps) {
  return (
    <TypeDetail config={config} params={params} searchParams={searchParams} />
  );
}
