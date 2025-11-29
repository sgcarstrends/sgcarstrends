import { getTopMakesByYear, getYearlyRegistrations } from "@web/queries/cars";
import { getAllCoeCategoryTrends, getLatestCoeResults } from "@web/queries/coe";
import { getAllPosts } from "@web/queries/posts";

/**
 * Load all data for the home page
 *
 * @returns COE trends, yearly car data, top makes, blog posts, and latest COE results
 */
export const loadHomePageData = async () => {
  const [coeTrends, yearlyData, latestTopMakes, allPosts, latestCoe] =
    await Promise.all([
      getAllCoeCategoryTrends(),
      getYearlyRegistrations(),
      getTopMakesByYear(),
      getAllPosts(),
      getLatestCoeResults(),
    ]);

  return {
    coeTrends,
    yearlyData,
    latestTopMakes,
    allPosts,
    latestCoe,
  };
};
