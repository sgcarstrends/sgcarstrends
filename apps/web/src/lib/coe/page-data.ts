import { redis } from "@sgcarstrends/utils";
import type { Period } from "@web/app/(dashboard)/coe/search-params";
import { LAST_UPDATED_COE_KEY } from "@web/config";
import { groupCOEResultsByBidding } from "@web/lib/coe/calculations";
import { loadLastUpdated } from "@web/lib/common";
import {
  getAllCoeCategoryTrends,
  getCoeMonths,
  getCoeResults,
  getCoeResultsByPeriod,
  getLatestCoeResults,
  getPqpRates,
} from "@web/queries/coe";

export const fetchCOEPageData = async (period: Period = "12m") => {
  const [monthsResult, coeResults, lastUpdated] = await Promise.all([
    getCoeMonths(),
    getCoeResultsByPeriod(period),
    redis.get<number>(LAST_UPDATED_COE_KEY),
  ]);

  const months = monthsResult.map(({ month }) => month);

  return {
    coeResults,
    months,
    lastUpdated,
    data: groupCOEResultsByBidding(coeResults),
  };
};

/**
 * Load all data for the COE overview page
 *
 * Uses getAllCoeCategoryTrends() to fetch all 5 categories in a single batched query
 * instead of 5 separate getCoeCategoryTrends() calls
 *
 * @returns COE trends by category, latest results, all results, PQP rates, and last updated timestamp
 */
export const loadCOEOverviewPageData = async () => {
  const [coeTrends, latestResults, allCoeResults, pqpRates, lastUpdated] =
    await Promise.all([
      getAllCoeCategoryTrends(),
      getLatestCoeResults(),
      getCoeResults(),
      getPqpRates(),
      loadLastUpdated("coe"),
    ]);

  return {
    coeTrends,
    latestResults,
    allCoeResults,
    pqpRates,
    lastUpdated,
  };
};
