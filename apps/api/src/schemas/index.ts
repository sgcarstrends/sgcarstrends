import { z } from "@hono/zod-openapi";

export const CarsRegistrationQuerySchema = z
  .object({ month: z.string() })
  .strict();

export const TopTypesQuerySchema = z
  .object({
    month: z.string().openapi({
      description: "Month in YYYY-MM format to get top types for",
      example: "2025-01",
    }),
  })
  .openapi({
    description: "Query parameters for top fuel and vehicle types endpoint",
  });

export const TopMakesQuerySchema = z
  .object({
    month: z.string().openapi({
      description: "Month in YYYY-MM format to get top makes for",
      example: "2025-01",
    }),
  })
  .openapi({
    description: "Query parameters for top makes by fuel type endpoint",
  });

export const TopTypeSchema = z
  .object({
    name: z.string(),
    total: z.number(),
  })
  .nullable();

export const TopTypesResponseSchema = z.object({
  month: z.string(),
  topFuelType: TopTypeSchema,
  topVehicleType: TopTypeSchema,
});

export const MakeCountSchema = z.object({
  make: z.string(),
  count: z.number(),
});

export const FuelTypeMakesSchema = z.object({
  fuelType: z.string(),
  total: z.number(),
  makes: z.array(MakeCountSchema),
});

export const TopMakesResponseSchema = z.array(FuelTypeMakesSchema);

export const ComparisonQuerySchema = z
  .object({
    month: z.string().openapi({
      description: "Month in YYYY-MM format to compare metrics for",
      example: "2025-01",
    }),
  })
  .openapi({
    description: "Query parameters for car metrics comparison endpoint",
  });

export const CategoryCountSchema = z.object({
  label: z.string(),
  count: z.number(),
});

export const PeriodDataSchema = z.object({
  total: z.number(),
  fuelType: z.array(CategoryCountSchema),
  vehicleType: z.array(CategoryCountSchema),
});

export const PeriodInfoSchema = z.object({
  period: z.string(),
  total: z.number(),
  fuelType: z.array(CategoryCountSchema),
  vehicleType: z.array(CategoryCountSchema),
});

export const ComparisonResponseSchema = z.object({
  currentMonth: PeriodInfoSchema,
  previousMonth: PeriodInfoSchema,
  previousYear: PeriodInfoSchema,
});

// Common schemas
export const MonthSchema = z.string().regex(/^\d{4}-\d{2}$/); // YYYY-MM format

// Makes routes
export const MakeParamSchema = z.object({ make: z.string() }).strict();

export const MakeQuerySchema = z
  .object({ month: MonthSchema.optional() })
  .strict();

// Cars routes
export const CarQuerySchema = z
  .object({
    month: MonthSchema.optional(),
    make: z.string().optional(),
    fuel_type: z.string().optional(),
    vehicle_type: z.string().optional(),
  })
  .strict();

export const MonthsQuerySchema = z
  .object({
    grouped: z.string().optional(),
  })
  .strict();

// COE routes
export const COEQuerySchema = z
  .object({
    sort: z.string().optional(),
    orderBy: z.string().optional(),
    month: MonthSchema.optional(),
    from: MonthSchema.optional(),
    to: MonthSchema.optional(),
  })
  .strict();

// Months routes
export const LatestMonthQuerySchema = z
  .object({
    type: z.enum(["cars", "coe"]).optional(),
  })
  .strict();

// Response schemas
export const MakeArraySchema = z.array(z.string());

export const MakesResponseSchema = MakeArraySchema;

export const MakeItemSchema = z.object({
  month: z.string(),
  fuelType: z.string(),
  vehicleType: z.string(),
  count: z.number(),
});

export const MakeResponseSchema = z.object({
  make: z.string(),
  total: z.number(),
  data: z.array(MakeItemSchema),
});

export const CarSchema = z.object({
  make: z.string(),
  model: z.string(),
  fuel_type: z.string(),
  vehicle_type: z.string(),
  month: z.string(),
  number: z.number(),
});

export const CarResponseSchema = z.array(CarSchema);

export const CarsByTypeSchema = z.object({
  month: z.string(),
  total: z.number(),
  fuelType: z.array(CategoryCountSchema),
  vehicleType: z.array(CategoryCountSchema),
});

export const COESchema = z.object({
  month: z.string(),
  bidding_no: z.number(),
  vehicle_class: z.string(),
  quota: z.number(),
  bids_received: z.number(),
  premium: z.number(),
});

export const COEResponseSchema = z.object({
  data: z.array(COESchema),
});

export const COEPQPResponseSchema = z.object({
  data: z.record(z.string(), z.record(z.string(), z.number())),
});

export const LatestMonthResponseSchema = z
  .object({
    cars: MonthSchema.optional(),
    coe: MonthSchema.optional(),
  })
  .strict();

export const MonthsByYearSchema = z.record(z.string(), z.array(z.string()));

export type ComparisonQuery = z.infer<typeof ComparisonQuerySchema>;
export type TopTypesQuery = z.infer<typeof TopTypesQuerySchema>;
export type MakeParams = z.infer<typeof MakeParamSchema>;
export type MakeQuery = z.infer<typeof MakeQuerySchema>;
export type CarQuery = z.infer<typeof CarQuerySchema>;
export type MonthsQuery = z.infer<typeof MonthsQuerySchema>;
export type COEQuery = z.infer<typeof COEQuerySchema>;
export type LatestMonthQuery = z.infer<typeof LatestMonthQuerySchema>;

export type Car = z.infer<typeof CarSchema>;
export type COE = z.infer<typeof COESchema>;
export type COEResponse = z.infer<typeof COEResponseSchema>;
export type COEPQPResponse = z.infer<typeof COEPQPResponseSchema>;
export type LatestMonthResponse = z.infer<typeof LatestMonthResponseSchema>;
export type MonthsByYear = z.infer<typeof MonthsByYearSchema>;
