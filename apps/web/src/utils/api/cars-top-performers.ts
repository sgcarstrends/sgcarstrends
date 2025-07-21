import { API_URL } from "@/config";
import { fetchApi } from "@/utils/fetch-api";

export interface TopTypeData {
  name: string;
  count: number;
  percentage: number;
  rank: number;
}

export interface TopMakeData {
  make: string;
  count: number;
  percentage: number;
  rank: number;
  fuelType?: string;
  vehicleType?: string;
}

export interface TopPerformersData {
  month: string;
  total: number;
  topFuelTypes: TopTypeData[];
  topVehicleTypes: TopTypeData[];
  topMakes: TopMakeData[];
}

export const fetchTopPerformers = async (
  month: string,
): Promise<TopPerformersData> => {
  const [topTypes, topMakes] = await Promise.all([
    fetchApi<{
      month: string;
      total: number;
      fuelType: Array<{ name: string; count: number }>;
      vehicleType: Array<{ name: string; count: number }>;
    }>(`${API_URL}/cars/top-types?month=${month}`),
    fetchApi<
      Array<{
        make: string;
        count: number;
        fuelType?: string;
        vehicleType?: string;
      }>
    >(`${API_URL}/cars/top-makes?month=${month}`),
  ]);

  const topFuelTypes = (topTypes.fuelType || []).map((fuel, index) => ({
    name: fuel.name,
    count: fuel.count,
    percentage: (fuel.count / topTypes.total) * 100,
    rank: index + 1,
  }));

  const topVehicleTypes = (topTypes.vehicleType || []).map(
    (vehicle, index) => ({
      name: vehicle.name,
      count: vehicle.count,
      percentage: (vehicle.count / topTypes.total) * 100,
      rank: index + 1,
    }),
  );

  const topMakesData = (topMakes || []).map((make, index) => ({
    make: make.make,
    count: make.count,
    percentage: (make.count / topTypes.total) * 100,
    rank: index + 1,
    fuelType: make.fuelType,
    vehicleType: make.vehicleType,
  }));

  return {
    month: topTypes.month,
    total: topTypes.total,
    topFuelTypes,
    topVehicleTypes,
    topMakes: topMakesData,
  };
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
