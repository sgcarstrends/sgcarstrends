import { redis } from "@sgcarstrends/utils";
import type { Period } from "@web/app/(dashboard)/coe/search-params";
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
import { format, subMonths, subYears } from "date-fns";

const getDateRangeFromPeriod = (
  period: Period,
  latestMonth: string,
  earliestMonth: string,
): { start: string; end: string } => {
  const latest = new Date(`${latestMonth}-01`);

  switch (period) {
    case "12m":
      return {
        start: format(subMonths(latest, 12), "yyyy-MM"),
        end: latestMonth,
      };
    case "5y":
      return {
        start: format(subYears(latest, 5), "yyyy-MM"),
        end: latestMonth,
      };
    case "10y":
      return {
        start: format(subYears(latest, 10), "yyyy-MM"),
        end: latestMonth,
      };
    case "ytd":
      return { start: `${new Date().getFullYear()}-01`, end: latestMonth };
    case "all":
      return { start: earliestMonth, end: latestMonth };
  }
};

export const fetchCOEPageData = async (period: Period = "12m") => {
  const monthsResult = await getCoeMonths();
  const months = monthsResult.map(({ month }) => month);
  const latestMonth = months[0];
  const earliestMonth = months[months.length - 1];

  const { start, end } = getDateRangeFromPeriod(
    period,
    latestMonth,
    earliestMonth,
  );

  const [coeResults, lastUpdated] = await Promise.all([
    getCoeResultsFiltered(undefined, start, end),
    redis.get<number>(LAST_UPDATED_COE_KEY),
  ]);

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
