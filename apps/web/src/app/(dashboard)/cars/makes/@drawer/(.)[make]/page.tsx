import { redis } from "@sgcarstrends/utils";
import { loadSearchParams } from "@web/app/(dashboard)/cars/makes/[make]/search-params";
import { MakeDrawer } from "@web/components/cars/makes";
import { MakeDetail } from "@web/components/cars/makes/make-detail";
import { LAST_UPDATED_CARS_KEY } from "@web/config";
import {
  checkMakeIfExist,
  getDistinctMakes,
  getMakeDetails,
} from "@web/lib/data/cars";
import type { Car } from "@web/types";
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

  const [makeExists, makeDetails, makesResult, lastUpdated] = await Promise.all(
    [
      checkMakeIfExist(make),
      getMakeDetails(make, month),
      getDistinctMakes(),
      redis.get<number>(LAST_UPDATED_CARS_KEY),
    ],
  );

  const makeName = makeExists?.make ?? make.toUpperCase();
  const makes = makesResult.map((m) => m.make);

  // Transform makeDetails to match expected cars format
  const cars = {
    make: makeName,
    total: makeDetails.total,
    data: makeDetails.data.map(
      (d): Car => ({
        month: d.month,
        make: makeName,
        fuel_type: d.fuelType as Car["fuel_type"],
        vehicle_type: d.vehicleType as Car["vehicle_type"],
        number: d.count,
      }),
    ),
  };

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
