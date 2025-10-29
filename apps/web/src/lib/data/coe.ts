"use server";

import type { COEResult } from "@web/types";
import type {
  COEComparisonMetrics,
  COEMarketShareResponse,
  COETrendData,
} from "@web/utils/api/coe";
import {
  COE_CHART_COLOURS,
  getCOEResults,
  getCOEResultsByPeriod,
} from "@web/utils/api/coe";

export const getCOEMarketShareData = async (
  period?: string,
): Promise<COEMarketShareResponse> => {
  const results = await getCOEResultsByPeriod(period);

  if (!results.length) {
    throw new Error("No COE results available for the specified period");
  }

  const totalQuota = results.reduce((sum, result) => sum + result.quota, 0);

  const marketShareData = results.map((result, index) => ({
    category: result.vehicle_class,
    premium: result.premium,
    percentage: (result.quota / totalQuota) * 100,
    quota: result.quota,
    colour: COE_CHART_COLOURS[index % COE_CHART_COLOURS.length],
  }));

  const highestPremium = results.reduce((max, current) =>
    current.premium > max.premium ? current : max,
  );

  return {
    period: results[0].month,
    totalQuota,
    data: marketShareData,
    highestPremium: {
      category: highestPremium.vehicle_class,
      premium: highestPremium.premium,
    },
  };
};

export const getCOETrendData = async (): Promise<COETrendData[]> => {
  const results = await getCOEResults();

  const groupedByPeriod = results.reduce(
    (acc, result) => {
      const period = result.month;
      if (!acc[period]) {
        acc[period] = [];
      }
      acc[period].push(result);
      return acc;
    },
    {} as Record<string, COEResult[]>,
  );

  return Object.entries(groupedByPeriod).map(([period, periodResults]) => ({
    period,
    categories: periodResults.map((result) => ({
      category: result.vehicle_class,
      premium: result.premium,
      quota: result.quota,
      bidsReceived: result.bids_received,
    })),
  }));
};

export const getCOEComparisonData = async (
  currentPeriod: string,
  previousPeriod: string,
): Promise<COEComparisonMetrics> => {
  const [current, previous] = await Promise.all([
    getCOEResultsByPeriod(currentPeriod),
    getCOEResultsByPeriod(previousPeriod),
  ]);

  const currentAvg =
    current.reduce((sum, r) => sum + r.premium, 0) / current.length;
  const previousAvg =
    previous.reduce((sum, r) => sum + r.premium, 0) / previous.length;
  const averagePremiumChange = currentAvg - previousAvg;

  const categoryChanges = current.map((currentResult) => {
    const previousResult = previous.find(
      (p) => p.vehicle_class === currentResult.vehicle_class,
    );
    const previousPremium = previousResult?.premium || 0;
    const change = currentResult.premium - previousPremium;
    const changePercent =
      previousPremium > 0 ? (change / previousPremium) * 100 : 0;

    return {
      category: currentResult.vehicle_class,
      current: currentResult.premium,
      previous: previousPremium,
      change,
      changePercent,
    };
  });

  return {
    currentPeriod: current,
    previousPeriod: previous,
    averagePremiumChange,
    categoryChanges,
  };
};
