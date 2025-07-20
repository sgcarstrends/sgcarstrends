import { API_URL } from "@/config";
import { fetchApi } from "@/utils/fetch-api";

export interface MonthlyComparisonData {
  month: string;
  total: number;
  fuelType: Array<{
    name: string;
    count: number;
  }>;
  vehicleType: Array<{
    name: string;
    count: number;
  }>;
}

export interface ComparisonMetrics {
  currentMonth: MonthlyComparisonData;
  previousMonth: MonthlyComparisonData;
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

export const fetchComparisonData = async (
  currentMonth: string,
  previousMonth: string,
): Promise<ComparisonMetrics> => {
  const [current, previous] = await Promise.all([
    fetchApi<MonthlyComparisonData>(`${API_URL}/cars?month=${currentMonth}`),
    fetchApi<MonthlyComparisonData>(`${API_URL}/cars?month=${previousMonth}`),
  ]);

  const growthRate = ((current.total - previous.total) / previous.total) * 100;

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
};

export const fetchHistoricalTrends = async (
  months: string[],
  category: "fuelType" | "vehicleType" = "fuelType",
): Promise<
  Array<{
    month: string;
    total: number;
    [key: string]: number | string;
  }>
> => {
  const data = await Promise.all(
    months.map((month) =>
      fetchApi<MonthlyComparisonData>(`${API_URL}/cars?month=${month}`),
    ),
  );

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
};
