import type { Context } from "hono";

/**
 * Error context for logging and debugging
 */
export interface ErrorContext {
  operation: string;
  details?: Record<string, unknown>;
}

/**
 * Wraps a route handler with standardized error handling
 * @param handler - The route handler function to wrap
 * @param errorContext - Context information for error logging
 * @returns Wrapped handler with error handling
 */
export const withErrorHandling = <T extends Context = Context>(
  handler: (c: T) => Promise<Response>,
  errorContext: ErrorContext,
) => {
  return async (c: T): Promise<Response> => {
    try {
      return await handler(c);
    } catch (e) {
      const error = e as Error;
      console.error(
        `Error in ${errorContext.operation}:`,
        error,
        errorContext.details,
      );
      return c.json(
        {
          error: `An error occurred while ${errorContext.operation}`,
          details: error.message,
        },
        500,
      );
    }
  };
};
