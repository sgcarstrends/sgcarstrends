import { redis } from "@sgcarstrends/utils";
import { LAST_UPDATED_CARS_KEY } from "@web/config";
import {
  checkMakeIfExist,
  getDistinctMakes,
  getMakeDetails,
} from "@web/lib/cars/queries";

export const fetchMakePageData = async (make: string, month?: string) => {
  const [makeExists, makeDetails, makesResult, lastUpdated] = await Promise.all(
    [
      checkMakeIfExist(make),
      getMakeDetails(make, month),
      getDistinctMakes(),
      redis.get<number>(LAST_UPDATED_CARS_KEY),
    ],
  );

  const makeName = makeExists?.make ?? make.toUpperCase();
  const makes = makesResult.map(({ make }) => make);

  const cars = {
    make: makeName,
    total: makeDetails.total,
    data: makeDetails.data,
  };

  return { cars, makes, lastUpdated, makeName };
};
