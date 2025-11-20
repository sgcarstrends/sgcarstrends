import { redis } from "@sgcarstrends/utils";
import {
  getDefaultEndDate,
  getDefaultStartDate,
} from "@web/app/(dashboard)/coe/search-params";
import { LAST_UPDATED_COE_KEY } from "@web/config";
import { groupCOEResultsByBidding } from "@web/lib/coe/calculations";
import { loadLastUpdated } from "@web/lib/common";
import {
  getCoeCategoryTrends,
  getCoeMonths,
  getCoeResults,
  getCoeResultsFiltered,
  getLatestCoeResults,
  getPqpRates,
} from "@web/queries/coe";

export const fetchCOEPageData = async (start?: string, end?: string) => {
  const defaultStart = await getDefaultStartDate();
  const defaultEnd = await getDefaultEndDate();
  const startDate = start || defaultStart;
  const endDate = end || defaultEnd;

  const [coeResults, monthsResult, lastUpdated] = await Promise.all([
    getCoeResultsFiltered(undefined, startDate, endDate),
    getCoeMonths(),
    redis.get<number>(LAST_UPDATED_COE_KEY),
  ]);

  return {
    coeResults,
    months: monthsResult.map(({ month }) => month),
    lastUpdated,
    data: groupCOEResultsByBidding(coeResults),
  };
};

/**
 * Load all data for the COE overview page
 *
 * @returns COE trends by category, latest results, all results, PQP rates, and last updated timestamp
 */
export const loadCOEOverviewPageData = async () => {
  const [
    trendA,
    trendB,
    trendC,
    trendD,
    trendE,
    latestResults,
    allCoeResults,
    pqpRates,
    lastUpdated,
  ] = await Promise.all([
    getCoeCategoryTrends("Category A"),
    getCoeCategoryTrends("Category B"),
    getCoeCategoryTrends("Category C"),
    getCoeCategoryTrends("Category D"),
    getCoeCategoryTrends("Category E"),
    getLatestCoeResults(),
    getCoeResults(),
    getPqpRates(),
    loadLastUpdated("coe"),
  ]);

  const coeTrends = {
    "Category A": trendA,
    "Category B": trendB,
    "Category C": trendC,
    "Category D": trendD,
    "Category E": trendE,
  };

  return {
    coeTrends,
    latestResults,
    allCoeResults,
    pqpRates,
    lastUpdated,
  };
};
