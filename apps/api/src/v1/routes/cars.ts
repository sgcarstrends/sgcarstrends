import { CACHE_TTL } from "@api/config";
import db from "@api/config/db";
import redis from "@api/config/redis";
import { getUniqueMonths } from "@api/lib/getUniqueMonths";
import { groupMonthsByYear } from "@api/lib/groupMonthsByYear";
import {
  CarQuerySchema,
  ComparisonQuerySchema,
  MonthsQuerySchema,
} from "@api/schemas";
import type { Make } from "@api/types";
import { buildFilters, fetchCars } from "@api/v1/service/car.service";
import { zValidator } from "@hono/zod-validator";
import { cars } from "@sgcarstrends/schema";
import { asc, eq } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono();

app.get("/", zValidator("query", CarQuerySchema), async (c) => {
  const query = c.req.query();

  const CACHE_KEY = `cars:${JSON.stringify(query)}`;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    return c.json(cachedData);
  }

  try {
    const filters = await buildFilters(query);
    const results = await fetchCars(filters);

    await redis.set(CACHE_KEY, JSON.stringify(results), { ex: 86400 });

    return c.json(results);
  } catch (e) {
    console.error("Car query error:", e);
    return c.json(
      {
        error: "An error occurred while fetching cars",
        details: e.message,
      },
      500,
    );
  }
});

app.get("/compare", zValidator("query", ComparisonQuerySchema), async (c) => {
  const query = c.req.query();
  const currentPeriod = query.month;
  const [yearStr, monthStr] = currentPeriod.split("-");
  const year = Number.parseInt(yearStr, 10);
  const month = Number.parseInt(monthStr, 10);

  let prevMonthYear = year;
  let prevMonth = month - 1;
  if (prevMonth < 1) {
    prevMonth = 12;
    prevMonthYear = year - 1;
  }
  const previousMonthPeriod = `${prevMonthYear}-${prevMonth.toString().padStart(2, "0")}`;
  const previousYearPeriod = `${year - 1}-${monthStr}`;

  const currentDataQ = db
    .select()
    .from(cars)
    .where(eq(cars.month, currentPeriod));
  const previousMonthDataQ = db
    .select()
    .from(cars)
    .where(eq(cars.month, previousMonthPeriod));
  const previousYearDataQ = db
    .select()
    .from(cars)
    .where(eq(cars.month, previousYearPeriod));
  const [currentData, previousMonthData, previousYearData] = await Promise.all([
    currentDataQ,
    previousMonthDataQ,
    previousYearDataQ,
  ]);

  const totalRegistrationsCurrent = currentData.reduce(
    (sum, record) => sum + record.number,
    0,
  );
  const totalRegistrationsPrevMonth = previousMonthData.reduce(
    (sum, record) => sum + record.number,
    0,
  );
  const totalRegistrationsPrevYear = previousYearData.reduce(
    (sum, record) => sum + record.number,
    0,
  );

  const calculatePctChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  // Update groupByProperty to sum the "number" field rather than count records.
  const groupByProperty = (data: any[], prop: string) =>
    data.reduce(
      (acc, record) => {
        const key = record[prop];
        acc[key] = (acc[key] || 0) + record.number;
        return acc;
      },
      {} as Record<string, number>,
    );

  // Group data by fuel_type and vehicle_type using numerical sums.
  const currentFuelData = groupByProperty(currentData, "fuel_type");
  const previousMonthFuelData = groupByProperty(previousMonthData, "fuel_type");
  const previousYearFuelData = groupByProperty(previousYearData, "fuel_type");

  const currentVehicleData = groupByProperty(currentData, "vehicle_type");
  const previousMonthVehicleData = groupByProperty(
    previousMonthData,
    "vehicle_type",
  );
  const previousYearVehicleData = groupByProperty(
    previousYearData,
    "vehicle_type",
  );

  // Get list of all unique fuel types from the three datasets.
  const fuelTypes = Array.from(
    new Set([
      ...Object.keys(currentFuelData),
      ...Object.keys(previousMonthFuelData),
      ...Object.keys(previousYearFuelData),
    ]),
  );
  const fuelTypesData = fuelTypes.map((fuel) => {
    const currentCount = currentFuelData[fuel] || 0;
    const prevMonthCount = previousMonthFuelData[fuel] || 0;
    const prevYearCount = previousYearFuelData[fuel] || 0;
    return {
      label: fuel,
      current: currentCount,
      monthly: {
        period: previousMonthPeriod,
        value: prevMonthCount,
        abs_change: currentCount - prevMonthCount,
        pct_change: calculatePctChange(currentCount, prevMonthCount),
      },
      yearly: {
        period: previousYearPeriod,
        value: prevYearCount,
        abs_change: currentCount - prevYearCount,
        pct_change: calculatePctChange(currentCount, prevYearCount),
      },
    };
  });

  // Get list of all unique vehicle types from the three datasets.
  const vehicleTypes = Array.from(
    new Set([
      ...Object.keys(currentVehicleData),
      ...Object.keys(previousMonthVehicleData),
      ...Object.keys(previousYearVehicleData),
    ]),
  );
  const vehicleTypesData = vehicleTypes.map((type) => {
    const currentCount = currentVehicleData[type] || 0;
    const prevMonthCount = previousMonthVehicleData[type] || 0;
    const prevYearCount = previousYearVehicleData[type] || 0;
    return {
      label: type,
      current: currentCount,
      monthly: {
        period: previousMonthPeriod,
        value: prevMonthCount,
        abs_change: currentCount - prevMonthCount,
        pct_change: calculatePctChange(currentCount, prevMonthCount),
      },
      yearly: {
        period: previousYearPeriod,
        value: prevYearCount,
        abs_change: currentCount - prevYearCount,
        pct_change: calculatePctChange(currentCount, prevYearCount),
      },
    };
  });

  const response = {
    period: currentPeriod,
    metrics: {
      total_registrations: {
        label: "Total Registrations",
        current: totalRegistrationsCurrent,
        monthly: {
          period: previousMonthPeriod,
          value: totalRegistrationsPrevMonth,
          abs_change: totalRegistrationsCurrent - totalRegistrationsPrevMonth,
          pct_change: calculatePctChange(
            totalRegistrationsCurrent,
            totalRegistrationsPrevMonth,
          ),
        },
        yearly: {
          period: previousYearPeriod,
          value: totalRegistrationsPrevYear,
          abs_change: totalRegistrationsCurrent - totalRegistrationsPrevYear,
          pct_change: calculatePctChange(
            totalRegistrationsCurrent,
            totalRegistrationsPrevYear,
          ),
        },
      },
      fuel_types: fuelTypesData,
      vehicle_types: vehicleTypesData,
    },
  };

  return c.json(response);
});

app.get("/months", zValidator("query", MonthsQuerySchema), async (c) => {
  const { grouped } = c.req.query();

  const months = await getUniqueMonths(cars);
  if (grouped) {
    return c.json(groupMonthsByYear(months));
  }

  return c.json(months);
});

app.get("/makes", async (c) => {
  const CACHE_KEY = "makes";

  let makes = await redis.zrange<Make[]>(CACHE_KEY, 0, -1);
  if (makes.length === 0) {
    makes = await db
      .selectDistinct({ make: cars.make })
      .from(cars)
      .orderBy(asc(cars.make))
      .then((res) => res.map(({ make }) => make));

    for (const make of makes) {
      await redis.zadd(CACHE_KEY, { score: 0, member: make });
    }
    await redis.expire(CACHE_KEY, CACHE_TTL);
  }

  return c.json(makes);
});

export default app;
