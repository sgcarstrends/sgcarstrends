import { redis } from "@sgcarstrends/utils";
import slugify from "@sindresorhus/slugify";
import { loadSearchParams } from "@web/app/(dashboard)/cars/makes/[make]/search-params";
import { MakeDrawer } from "@web/components/makes";
import { MakeDetail } from "@web/components/makes/make-detail";
import { API_URL, LAST_UPDATED_CARS_KEY } from "@web/config";
import type { Car, Make } from "@web/types";
import { fetchApi } from "@web/utils/fetch-api";
import { getMonthOrLatest } from "@web/utils/month-utils";
import type { SearchParams } from "nuqs/server";

interface Props {
  params: Promise<{ make: string }>;
  searchParams: Promise<SearchParams>;
}

const MakePage = async ({ params, searchParams }: Props) => {
  const { make } = await params;
  let { month } = await loadSearchParams(searchParams);

  month = await getMonthOrLatest(month, "cars");

  const [cars, makes]: [{ make: string; total: number; data: Car[] }, Make[]] =
    await Promise.all([
      fetchApi<{ make: string; total: number; data: Car[] }>(
        `${API_URL}/cars/makes/${slugify(make)}`,
      ),
      fetchApi<Make[]>(`${API_URL}/cars/makes`),
    ]);

  const lastUpdated = await redis.get<number>(LAST_UPDATED_CARS_KEY);

  return (
    <MakeDrawer>
      <MakeDetail
        make={make}
        cars={cars}
        makes={makes}
        lastUpdated={lastUpdated}
      />
    </MakeDrawer>
  );
};

export default MakePage;
