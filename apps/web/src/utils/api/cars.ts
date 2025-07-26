import { API_URL } from "@web/config";
import { RevalidateTags } from "@web/types";
import type {
  Comparison,
  FuelType,
  Registration,
  TopType,
} from "@web/types/cars";
import { CACHE_DURATION, fetchApi } from "@web/utils/fetch-api";
import { cache } from "react";

// Cars-specific types
export interface CarMarketShareData {
  name: string;
  count: number;
  percentage: number;
  colour: string;
}

export interface CarMarketShareResponse {
  month: string;
  total: number;
  category: "fuelType" | "vehicleType";
  data: CarMarketShareData[];
  dominantType: {
    name: string;
    percentage: number;
  };
}

export interface CarTopTypeData {
  name: string;
  count: number;
  percentage: number;
  rank: number;
}

export interface CarTopMakeData {
  make: string;
  count: number;
  percentage: number;
  rank: number;
  fuelType?: string;
  vehicleType?: string;
}

export interface CarTopPerformersData {
  month: string;
  total: number;
  topFuelTypes: CarTopTypeData[];
  topVehicleTypes: CarTopTypeData[];
  topMakes: CarTopMakeData[];
}

export interface CarComparisonData {
  month: string;
  total: number;
  fuelType: Array<{ name: string; count: number }>;
  vehicleType: Array<{ name: string; count: number }>;
}

export interface CarComparisonMetrics {
  currentMonth: CarComparisonData;
  previousMonth: CarComparisonData;
  growthRate: number;
  monthOverMonth: {
    total: number;
    fuelTypes: Array<{
      name: string;
      current: number;
      previous: number;
      growth: number;
    }>;
    vehicleTypes: Array<{
      name: string;
      current: number;
      previous: number;
      growth: number;
    }>;
  };
}

// Chart color palette for cars data
export const CAR_CHART_COLOURS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#6366f1",
  "#f97316",
  "#14b8a6",
  "#84cc16",
] as const;

// ========== CACHED API FUNCTIONS ==========

/**
 * Cached car registration data fetcher
 */
export const getCarsData = cache(
  async (month: string): Promise<Registration> => {
    return fetchApi<Registration>(`${API_URL}/cars?month=${month}`, {
      next: {
        tags: [RevalidateTags.Cars, `${RevalidateTags.Cars}:${month}`],
        revalidate: CACHE_DURATION,
      },
    });
  },
);

/**
 * Cached car comparison data fetcher
 */
export const getCarsComparison = cache(
  async (month: string): Promise<Comparison> => {
    return fetchApi<Comparison>(`${API_URL}/cars/compare?month=${month}`, {
      next: {
        tags: [
          RevalidateTags.Analysis,
          RevalidateTags.Comparison,
          RevalidateTags.Cars,
        ],
        revalidate: CACHE_DURATION,
      },
    });
  },
);

/**
 * Cached top vehicle types data fetcher
 */
export const getTopTypes = cache(async (month: string): Promise<TopType> => {
  return fetchApi<TopType>(`${API_URL}/cars/top-types?month=${month}`, {
    next: {
      tags: [
        RevalidateTags.Analysis,
        RevalidateTags.TopPerformers,
        RevalidateTags.Cars,
      ],
      revalidate: CACHE_DURATION,
    },
  });
});

/**
 * Cached top makes data fetcher
 */
export const getTopMakes = cache(async (month: string): Promise<FuelType[]> => {
  return fetchApi<FuelType[]>(`${API_URL}/cars/top-makes?month=${month}`, {
    next: {
      tags: [
        RevalidateTags.Analysis,
        RevalidateTags.TopPerformers,
        RevalidateTags.Cars,
      ],
      revalidate: CACHE_DURATION,
    },
  });
});

/**
 * Cached makes list fetcher
 */
export const getMakesList = cache(async (): Promise<string[]> => {
  return fetchApi<string[]>(`${API_URL}/cars/makes`, {
    next: {
      tags: [RevalidateTags.Reference, RevalidateTags.Cars],
      revalidate: CACHE_DURATION,
    },
  });
});

/**
 * Cached latest month data fetcher for cars
 */
export const getLatestCarMonth = cache(async (): Promise<{ month: string }> => {
  return fetchApi<{ month: string }>(`${API_URL}/cars/months/latest`, {
    next: {
      tags: [RevalidateTags.Latest, RevalidateTags.Reference, "cars"],
      revalidate: CACHE_DURATION,
    },
  });
});

/**
 * Cached months list fetcher for cars
 */
export const getCarMonthsList = cache(async (): Promise<string[]> => {
  return fetchApi<string[]>(`${API_URL}/cars/months`, {
    next: {
      tags: [RevalidateTags.Reference, "cars"],
      revalidate: CACHE_DURATION,
    },
  });
});

// ========== COMPUTED DATA FUNCTIONS ==========

/**
 * Cached market share data processor
 */
export const getCarMarketShareData = cache(
  async (
    month: string,
    category: "fuelType" | "vehicleType",
  ): Promise<CarMarketShareResponse> => {
    const response = await getCarsData(month);

    const categoryData = response[category];
    const total = response.total;

    const marketShareData = categoryData.map((item, index) => ({
      name: item.name,
      count: item.count,
      percentage: (item.count / total) * 100,
      colour: CAR_CHART_COLOURS[index % CAR_CHART_COLOURS.length],
    }));

    const dominantType = marketShareData.reduce((max, current) =>
      current.percentage > max.percentage ? current : max,
    );

    return {
      month: response.month,
      total,
      category,
      data: marketShareData,
      dominantType: {
        name: dominantType.name,
        percentage: dominantType.percentage,
      },
    };
  },
);

/**
 * Cached top performers data processor
 */
export const getCarTopPerformersData = cache(
  async (month: string): Promise<CarTopPerformersData> => {
    const [topTypes, topMakes] = await Promise.all([
      getTopTypes(month),
      getTopMakes(month),
    ]);

    // Get cars data to calculate totals and percentages
    const carsData = await getCarsData(month);
    const total = carsData.total;

    const topFuelTypes = [
      {
        name: topTypes.topFuelType.name,
        count: topTypes.topFuelType.total,
        percentage: (topTypes.topFuelType.total / total) * 100,
        rank: 1,
      },
    ];

    const topVehicleTypes = [
      {
        name: topTypes.topVehicleType.name,
        count: topTypes.topVehicleType.total,
        percentage: (topTypes.topVehicleType.total / total) * 100,
        rank: 1,
      },
    ];

    const topMakesData = topMakes.map((make, index) => ({
      make: make.fuelType || "Unknown",
      count: make.total,
      percentage: (make.total / total) * 100,
      rank: index + 1,
    }));

    return {
      month: topTypes.month,
      total,
      topFuelTypes,
      topVehicleTypes,
      topMakes: topMakesData,
    };
  },
);

/**
 * Cached comparison data processor
 */
export const getCarComparisonData = cache(
  async (
    currentMonth: string,
    previousMonth: string,
  ): Promise<CarComparisonMetrics> => {
    const [current, previous] = await Promise.all([
      getCarsData(currentMonth),
      getCarsData(previousMonth),
    ]);

    const growthRate =
      ((current.total - previous.total) / previous.total) * 100;

    const fuelTypesComparison = current.fuelType.map((fuel) => {
      const previousFuel = previous.fuelType.find((f) => f.name === fuel.name);
      const previousCount = previousFuel?.count || 0;
      const growth =
        previousCount > 0
          ? ((fuel.count - previousCount) / previousCount) * 100
          : 0;

      return {
        name: fuel.name,
        current: fuel.count,
        previous: previousCount,
        growth,
      };
    });

    const vehicleTypesComparison = current.vehicleType.map((vehicle) => {
      const previousVehicle = previous.vehicleType.find(
        (v) => v.name === vehicle.name,
      );
      const previousCount = previousVehicle?.count || 0;
      const growth =
        previousCount > 0
          ? ((vehicle.count - previousCount) / previousCount) * 100
          : 0;

      return {
        name: vehicle.name,
        current: vehicle.count,
        previous: previousCount,
        growth,
      };
    });

    return {
      currentMonth: current,
      previousMonth: previous,
      growthRate,
      monthOverMonth: {
        total: growthRate,
        fuelTypes: fuelTypesComparison,
        vehicleTypes: vehicleTypesComparison,
      },
    };
  },
);

/**
 * Cached historical trends data processor
 */
export const getCarHistoricalTrends = cache(
  async (
    months: string[],
    category: "fuelType" | "vehicleType" = "fuelType",
  ) => {
    const data = await Promise.all(months.map((month) => getCarsData(month)));

    return data.map((monthData) => {
      const result: {
        month: string;
        total: number;
        [key: string]: number | string;
      } = {
        month: monthData.month,
        total: monthData.total,
      };

      monthData[category].forEach((item) => {
        result[item.name] = item.count;
      });

      return result;
    });
  },
);

// ========== UTILITY FUNCTIONS ==========

/**
 * Calculate market share insights for cars data
 */
export const calculateCarMarketShareInsights = (
  data: CarMarketShareData[],
): {
  diversity: number;
  concentration: number;
  top3Share: number;
  insights: string[];
} => {
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  const diversity = data.length;
  const concentration = sortedData[0]?.percentage || 0;
  const top3Share = sortedData
    .slice(0, 3)
    .reduce((sum, item) => sum + item.percentage, 0);

  const insights: string[] = [];

  if (concentration > 50) {
    insights.push(
      `${sortedData[0].name} dominates with ${concentration.toFixed(1)}% market share`,
    );
  }

  if (top3Share > 80) {
    insights.push("Market is highly concentrated amongst top 3 categories");
  } else if (top3Share < 60) {
    insights.push("Market shows good diversity across categories");
  }

  if (diversity > 6) {
    insights.push("High category diversity in registrations");
  }

  return {
    diversity,
    concentration,
    top3Share,
    insights,
  };
};

/**
 * Format car market share data for chart visualization
 */
export const formatCarMarketShareForChart = (
  data: CarMarketShareData[],
): Array<{
  name: string;
  value: number;
  colour: string;
}> => {
  return data.map((item) => ({
    name: item.name,
    value: item.count,
    colour: item.colour,
  }));
};

/**
 * Get ranking emoji for car performance data
 */
export const getRankingEmoji = (rank: number): string => {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return `#${rank}`;
  }
};
