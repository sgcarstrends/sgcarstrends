import pino from "pino";

export interface LogContext {
  requestId?: string;
  operation?: string;
  brand?: string;
  duration?: number;
  [key: string]: unknown;
}

const logger = pino({
  level: "info",
});

/**
 * Log info message with context
 */
export const logInfo = (message: string, context?: LogContext): void => {
  logger.info(context, message);
};

/**
 * Log error message with context and error details
 */
export const logError = (
  message: string,
  error?: Error | unknown,
  context?: LogContext,
): void => {
  if (error) {
    if (error instanceof Error) {
      logger.error(
        { ...context, error: error.message, stack: error.stack },
        message,
      );
    } else {
      logger.error({ ...context, error }, message);
    }
  } else {
    logger.error(context, message);
  }
};
