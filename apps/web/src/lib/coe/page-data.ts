import { redis } from "@sgcarstrends/utils";
import type { Period } from "@web/app/(dashboard)/coe/search-params";
import { LAST_UPDATED_COE_KEY } from "@web/config";
import {
  calculateBiggestMovers,
  calculateNearRecords,
  calculatePremiumRangeStats,
  generateKeyInsights,
  groupCOEResultsByBidding,
} from "@web/lib/coe/calculations";
import { loadLastUpdated } from "@web/lib/common";
import {
  getAllCoeCategoryTrends,
  getCoeMonths,
  getCoeResults,
  getCoeResultsByPeriod,
  getLatestAndPreviousCoeResults,
  getMonthBiddingRounds,
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

const ALL_CATEGORIES = [
  "Category A",
  "Category B",
  "Category C",
  "Category D",
  "Category E",
];

/**
 * Load all data for the COE overview page
 *
 * Uses getAllCoeCategoryTrends() to fetch all 5 categories in a single batched query
 * instead of 5 separate getCoeCategoryTrends() calls
 *
 * @returns COE trends, latest results, PQP rates, premium range stats, movers, key insights, and last updated timestamp
 */
export const loadCOEOverviewPageData = async () => {
  const [coeTrends, latestAndPrevious, allCoeResults, pqpRates, lastUpdated] =
    await Promise.all([
      getAllCoeCategoryTrends(),
      getLatestAndPreviousCoeResults(),
      getCoeResults(),
      getPqpRates(),
      loadLastUpdated("coe"),
    ]);

  const { latest: latestResults, previous: previousResults } =
    latestAndPrevious;

  // Calculate premium range stats for key insights
  const premiumRangeStats = calculatePremiumRangeStats(
    allCoeResults,
    ALL_CATEGORIES,
  );

  // Calculate key insights data
  const movers = calculateBiggestMovers(latestResults, previousResults);
  const nearRecords = calculateNearRecords(latestResults, premiumRangeStats);
  const keyInsights = generateKeyInsights(movers, nearRecords);

  return {
    coeTrends,
    latestResults,
    pqpRates,
    lastUpdated,
    premiumRangeStats,
    movers,
    keyInsights,
  };
};

/**
 * Load data for the COE Results page
 *
 * Loads period-filtered COE results with chart data for trends and historical analysis.
 * Also fetches bidding rounds (1st and 2nd) for the selected or latest month.
 *
 * @param period - Time period for filtering (12m, 5y, 10y, ytd, all)
 * @param month - Optional specific month to show bidding rounds for (YYYY-MM format)
 * @returns COE results, grouped chart data, bidding rounds, and last updated timestamp
 */
export const loadResultsPageData = async (
  period: Period = "12m",
  month?: string,
) => {
  const [periodData, monthRounds] = await Promise.all([
    fetchCOEPageData(period),
    getMonthBiddingRounds(month),
  ]);

  return {
    coeResults: periodData.coeResults,
    chartData: periodData.data,
    lastUpdated: periodData.lastUpdated,
    months: periodData.months,
    // Bidding rounds for selected month
    biddingMonth: monthRounds.month,
    firstRound: monthRounds.firstRound,
    secondRound: monthRounds.secondRound,
  };
};
