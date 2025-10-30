import { redis } from "@sgcarstrends/utils";
import {
  getDefaultEndDate,
  getDefaultStartDate,
} from "@web/app/(dashboard)/coe/search-params";
import { LAST_UPDATED_COE_KEY } from "@web/config";
import { groupCOEResultsByBidding } from "@web/lib/coe/calculations";
import { getCOEMonths, getCOEResultsFiltered } from "@web/lib/coe/queries";

export const fetchCOEPageData = async (start?: string, end?: string) => {
  const defaultStart = await getDefaultStartDate();
  const defaultEnd = await getDefaultEndDate();
  const startDate = start || defaultStart;
  const endDate = end || defaultEnd;

  const [coeResults, monthsResult, lastUpdated] = await Promise.all([
    getCOEResultsFiltered(undefined, startDate, endDate),
    getCOEMonths(),
    redis.get<number>(LAST_UPDATED_COE_KEY),
  ]);

  return {
    coeResults,
    months: monthsResult.map(({ month }) => month),
    lastUpdated,
    data: groupCOEResultsByBidding(coeResults),
  };
};
