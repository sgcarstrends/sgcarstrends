import { MakeDrawer } from "@web/app/(dashboard)/cars/_components/makes";
import { MakeDetail } from "@web/app/(dashboard)/cars/_components/makes/make-detail";
import { loadSearchParams } from "@web/app/(dashboard)/cars/makes/[make]/search-params";
import { fetchMakePageData } from "@web/lib/cars/make-data";
import { getMonthOrLatest } from "@web/utils/months";
import type { SearchParams } from "nuqs/server";

interface Props {
  params: Promise<{ make: string }>;
  searchParams: Promise<SearchParams>;
}

const MakePage = async ({ params, searchParams }: Props) => {
  const { make } = await params;
  let { month } = await loadSearchParams(searchParams);

  month = await getMonthOrLatest(month, "cars");

  const { cars, makes, lastUpdated } = await fetchMakePageData(make, month);

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
