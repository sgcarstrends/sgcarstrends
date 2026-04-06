import { slugify } from "@sgcarstrends/utils";
import {
  loadTypeSearchParams,
  TypeDetail,
  type TypeDetailConfig,
} from "@web/app/(main)/(explore)/cars/components/category/type-detail";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { getDistinctVehicleTypes } from "@web/queries/cars";
import { getMonthOrLatest } from "@web/utils/dates/months";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

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
  const { month: parsedMonth } = await loadTypeSearchParams(searchParams);
  const { month } = await getMonthOrLatest(parsedMonth, "cars");

  const title = "Cars in Singapore";
  const description = config.description;
  const canonical = `/cars/vehicle-types/${type}?month=${month}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonical}`,
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
