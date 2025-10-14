import { z } from "@hono/zod-openapi";

// Common schemas
export const MonthSchema = z.string().regex(/^\d{4}-\d{2}$/); // YYYY-MM format

export const CategoryCountSchema = z.object({
  name: z.string(),
  count: z.number(),
});

// Query schemas
export const CarQuerySchema = z
  .object({
    month: MonthSchema.optional(),
    make: z.string().optional(),
    fuel_type: z.string().optional(),
    vehicle_type: z.string().optional(),
  })
  .strict();

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

export const PopularMakesQuerySchema = z
  .object({
    year: z
      .string()
      .regex(/^\d{4}$/)
      .optional()
      .openapi({
        description: "Year in YYYY format to get popular makes for",
        example: "2024",
      }),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(20)
      .optional()
      .default(8)
      .openapi({
        description: "Maximum number of popular makes to return",
        example: 8,
      }),
  })
  .openapi({
    description: "Query parameters for popular makes endpoint",
  });

export const MonthsQuerySchema = z
  .object({
    grouped: z.string().optional(),
  })
  .strict();

// Param schemas
export const MakeParamSchema = z.object({ make: z.string() }).strict();

export const FuelTypeParamSchema = z
  .object({
    fuelType: z.string(),
  })
  .strict();

export const VehicleTypeParamSchema = z
  .object({
    vehicleType: z.string(),
  })
  .strict();

export const MakeQuerySchema = z
  .object({ month: MonthSchema.optional() })
  .strict();

// Response schemas
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

export const PopularMakeSchema = z.object({
  make: z.string(),
  registrations: z.number(),
  percentage: z.number(),
});

export const PopularMakesResponseSchema = z.object({
  year: z.string(),
  totalRegistrations: z.number(),
  makes: z.array(PopularMakeSchema),
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

export const FuelTypesResponseSchema = z.array(z.string());
export const VehicleTypesResponseSchema = z.array(z.string());

export const FuelTypeDataSchema = z.object({
  total: z.number(),
  data: z.array(CarSchema),
});

export const VehicleTypeDataSchema = z.object({
  total: z.number(),
  data: z.array(CarSchema),
});

export const MonthsByYearSchema = z.record(z.string(), z.array(z.string()));

export const MonthsResponseSchema = z.union([
  z.array(z.string()),
  MonthsByYearSchema,
]);

// Type exports
export type ComparisonQuery = z.infer<typeof ComparisonQuerySchema>;
export type TopTypesQuery = z.infer<typeof TopTypesQuerySchema>;
export type MakeParams = z.infer<typeof MakeParamSchema>;
export type MakeQuery = z.infer<typeof MakeQuerySchema>;
export type CarQuery = z.infer<typeof CarQuerySchema>;
export type MonthsQuery = z.infer<typeof MonthsQuerySchema>;
export type Car = z.infer<typeof CarSchema>;
export type MonthsByYear = z.infer<typeof MonthsByYearSchema>;
