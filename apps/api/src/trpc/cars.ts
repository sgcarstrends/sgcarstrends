import {
  checkMakeIfExist,
  getCarRegistrationByMonth,
  getCarsByFuelType,
  getCarsByVehicleType,
  getCarsTopMakesByFuelType,
  getDistinctFuelTypes,
  getDistinctMakes,
  getDistinctVehicleTypes,
  getFuelTypeByMonth,
  getMake,
  getTopTypes,
  getVehicleTypeByMonth,
} from "@api/queries/cars";
import {
  CarsByTypeSchema,
  ComparisonQuerySchema,
  ComparisonResponseSchema,
  FuelTypeDataSchema,
  FuelTypesResponseSchema,
  MakeResponseSchema,
  MakesResponseSchema,
  MonthSchema,
  TopMakesQuerySchema,
  TopMakesResponseSchema,
  TopTypesQuerySchema,
  TopTypesResponseSchema,
  VehicleTypeDataSchema,
  VehicleTypesResponseSchema,
} from "@api/schemas";
import { getCarMetricsForPeriod } from "@api/v1/service/car.service";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "./index";
import { withErrorHandling } from "./utils";

export const carsRouter = router({
  getByMonth: publicProcedure
    .input(
      z.object({
        month: MonthSchema,
      }),
    )
    .output(CarsByTypeSchema)
    .query(async ({ input }) =>
      withErrorHandling(async () => {
        const { month } = input;
        const [{ total }] = await getCarRegistrationByMonth(month);
        const fuelType = await getCarsByFuelType(month);
        const vehicleType = await getCarsByVehicleType(month);

        return { month, total, fuelType, vehicleType };
      }, "Failed to get car data by month"),
    ),

  compare: publicProcedure
    .input(ComparisonQuerySchema)
    .output(ComparisonResponseSchema)
    .query(async ({ input }) =>
      withErrorHandling(async () => {
        const { month } = input;
        return await getCarMetricsForPeriod(month);
      }, "Failed to compare car metrics"),
    ),

  topMakes: publicProcedure
    .input(TopMakesQuerySchema)
    .output(TopMakesResponseSchema)
    .query(async ({ input }) => {
      try {
        const { month } = input;
        const result = await getCarsTopMakesByFuelType(month);
        return result;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get top makes",
          cause: error,
        });
      }
    }),

  topTypes: publicProcedure
    .input(TopTypesQuerySchema)
    .output(TopTypesResponseSchema)
    .query(async ({ input }) => {
      try {
        const { month } = input;
        const [fuelTypeResult, vehicleTypeResult] = await getTopTypes(month);

        const topFuelType = {
          name: fuelTypeResult[0].name,
          total: fuelTypeResult[0].total,
        };

        const topVehicleType = {
          name: vehicleTypeResult[0].name,
          total: vehicleTypeResult[0].total,
        };

        return {
          month,
          topFuelType,
          topVehicleType,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get top types",
          cause: error,
        });
      }
    }),

  fuelTypes: publicProcedure
    .input(
      z.object({
        month: z.string().optional(),
      }),
    )
    .output(FuelTypesResponseSchema)
    .query(async ({ input }) => {
      try {
        const { month } = input;
        const result = await getDistinctFuelTypes(month);
        const fuelTypes = result.map(({ fuelType }) => fuelType);
        return fuelTypes;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get fuel types",
          cause: error,
        });
      }
    }),

  fuelTypeData: publicProcedure
    .input(
      z.object({
        fuelType: z.string(),
        month: z.string().optional(),
      }),
    )
    .output(FuelTypeDataSchema)
    .query(async ({ input }) => {
      try {
        const { fuelType, month } = input;
        const [totalResult, result] = await getFuelTypeByMonth(fuelType, month);
        return { total: totalResult[0].total, data: result };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get fuel type data",
          cause: error,
        });
      }
    }),

  vehicleTypes: publicProcedure
    .input(
      z.object({
        month: z.string().optional(),
      }),
    )
    .output(VehicleTypesResponseSchema)
    .query(async ({ input }) => {
      try {
        const { month } = input;
        const result = await getDistinctVehicleTypes(month);
        const vehicleTypes = result.map(({ vehicleType }) => vehicleType);
        return vehicleTypes;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get vehicle types",
          cause: error,
        });
      }
    }),

  vehicleTypeData: publicProcedure
    .input(
      z.object({
        vehicleType: z.string(),
        month: z.string().optional(),
      }),
    )
    .output(VehicleTypeDataSchema)
    .query(async ({ input }) => {
      try {
        const { vehicleType, month } = input;
        const [totalResult, result] = await getVehicleTypeByMonth(
          vehicleType,
          month,
        );
        return { total: totalResult[0].total, data: result };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get vehicle type data",
          cause: error,
        });
      }
    }),

  makes: publicProcedure
    .input(z.object({}))
    .output(MakesResponseSchema)
    .query(async () => {
      try {
        const result = await getDistinctMakes();
        const makes = result.map(({ make }) => make);
        return makes;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get makes",
          cause: error,
        });
      }
    }),

  makeData: publicProcedure
    .input(
      z.object({
        make: z.string(),
        month: MonthSchema.optional(),
      }),
    )
    .output(MakeResponseSchema)
    .query(async ({ input }) => {
      try {
        const { make, month } = input;
        const makeExists = await checkMakeIfExist(make);

        if (!makeExists) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Make not found",
          });
        }

        const { total, data } = await getMake(makeExists.make, month);

        return {
          make: makeExists.make,
          total,
          data,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get make data",
          cause: error,
        });
      }
    }),
});
