import { TRPCError } from "@trpc/server";

export const handleTRPCError = (error: unknown, message: string): never => {
  if (error instanceof TRPCError) {
    throw error;
  }
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message,
    cause: error,
  });
};

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage: string,
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    return handleTRPCError(error, errorMessage);
  }
};
