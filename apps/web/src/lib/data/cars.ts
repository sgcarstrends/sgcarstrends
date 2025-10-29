"use server";

import { API_URL } from "@web/config";
import { RevalidateTags } from "@web/types";
import type {
  Comparison,
  FuelType,
  Registration,
  TopType,
} from "@web/types/cars";
import { CACHE_DURATION, fetchApi } from "@web/utils/fetch-api";

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

export const getCarMarketShareData = async (
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
    colour: [
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
    ][index % 10],
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
};

export const getCarTopPerformersData = async (
  month: string,
): Promise<CarTopPerformersData> => {
  const [topTypes, topMakes] = await Promise.all([
    getTopTypes(month),
    getTopMakes(month),
  ]);

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
};
