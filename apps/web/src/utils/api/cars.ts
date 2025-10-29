import { API_URL } from "@web/config";
import { RevalidateTags } from "@web/types";
import type {
  Comparison,
  FuelType,
  Registration,
  TopType,
} from "@web/types/cars";
import { CACHE_DURATION, fetchApi } from "@web/utils/fetch-api";

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

export const getCarsData = async (month: string): Promise<Registration> => {
  return fetchApi<Registration>(`${API_URL}/cars?month=${month}`, {
    next: {
      tags: [RevalidateTags.Cars, `${RevalidateTags.Cars}:${month}`],
      revalidate: CACHE_DURATION,
    },
  });
};

export const getCarsComparison = async (month: string): Promise<Comparison> => {
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
};

export const getTopTypes = async (month: string): Promise<TopType> => {
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
};

export const getTopMakes = async (month: string): Promise<FuelType[]> => {
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
};

export const getMakesList = async (): Promise<string[]> => {
  return fetchApi<string[]>(`${API_URL}/cars/makes`, {
    next: {
      tags: [RevalidateTags.Reference, RevalidateTags.Cars],
      revalidate: CACHE_DURATION,
    },
  });
};

export const getLatestCarMonth = async (): Promise<{ month: string }> => {
  return fetchApi<{ month: string }>(`${API_URL}/cars/months/latest`, {
    next: {
      tags: [RevalidateTags.Latest, RevalidateTags.Reference, "cars"],
      revalidate: CACHE_DURATION,
    },
  });
};

export const getCarMonthsList = async (): Promise<string[]> => {
  return fetchApi<string[]>(`${API_URL}/cars/months`, {
    next: {
      tags: [RevalidateTags.Reference, "cars"],
      revalidate: CACHE_DURATION,
    },
  });
};

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
