"use server";

import { cache } from "react";
import "server-only";
import type {
  CarComparisonMetrics,
  CarMarketShareResponse,
  CarTopPerformersData,
} from "@web/utils/api/cars";
import { getCarsData, getTopMakes, getTopTypes } from "@web/utils/api/cars";

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
  },
);

export const getCarTopPerformersData = cache(
  async (month: string): Promise<CarTopPerformersData> => {
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
  },
);

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
