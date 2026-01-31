import { FatalError, getStepMetadata, RetryableError } from "workflow";

/**
 * Error categories for workflow steps.
 */
export type ErrorCategory = "lta-datamall" | "ai-generation" | "database";

/**
 * Options for the withErrorHandling wrapper.
 */
interface ErrorHandlingOptions {
  category: ErrorCategory;
  context?: string;
}

/**
 * Classifies an error and throws the appropriate WDK error type.
 * - RetryableError: For transient errors that should be retried
 * - FatalError: For unrecoverable errors that should not be retried
 */
export function handleStepError(
  error: unknown,
  options: ErrorHandlingOptions,
): never {
  const metadata = getStepMetadata();
  const message = error instanceof Error ? error.message : String(error);
  const { category, context } = options;
  const prefix = context ? `[${context}] ` : "";

  // Network/connection errors - always retry with exponential backoff
  if (isNetworkError(message)) {
    throw new RetryableError(`${prefix}Network error: ${message}`, {
      retryAfter: metadata.attempt ** 2 * 1000,
    });
  }

  // Category-specific error handling
  switch (category) {
    case "lta-datamall":
      handleLtaDatamallError(message, metadata.attempt, prefix);
      break;
    case "ai-generation":
      handleAiGenerationError(message, metadata.attempt, prefix);
      break;
    case "database":
      handleDatabaseError(message, metadata.attempt, prefix);
      break;
  }

  // Default: throw as FatalError
  throw new FatalError(`${prefix}Unhandled error: ${message}`);
}

/**
 * Check if error is a network-related error.
 */
function isNetworkError(message: string): boolean {
  const networkPatterns = [
    "ECONNREFUSED",
    "ECONNRESET",
    "ETIMEDOUT",
    "ENOTFOUND",
    "fetch failed",
    "network",
    "socket",
  ];
  return networkPatterns.some((pattern) =>
    message.toLowerCase().includes(pattern.toLowerCase()),
  );
}

/**
 * Handle LTA DataMall API errors.
 */
function handleLtaDatamallError(
  message: string,
  attempt: number,
  prefix: string,
): never {
  // Server errors (5xx) - retry with exponential backoff
  if (message.includes("5") && /\b5\d{2}\b/.test(message)) {
    throw new RetryableError(`${prefix}LTA server error: ${message}`, {
      retryAfter: attempt ** 2 * 1000,
    });
  }

  // Rate limiting - retry after delay
  if (message.includes("429") || message.toLowerCase().includes("rate")) {
    throw new RetryableError(`${prefix}LTA rate limited: ${message}`, {
      retryAfter: "30s",
    });
  }

  // Timeout - retry with longer backoff
  if (message.toLowerCase().includes("timeout")) {
    throw new RetryableError(`${prefix}LTA timeout: ${message}`, {
      retryAfter: attempt * 5000,
    });
  }

  // Auth errors - don't retry
  if (message.includes("401") || message.includes("403")) {
    throw new FatalError(`${prefix}LTA auth error: ${message}`);
  }

  // Default: fatal
  throw new FatalError(`${prefix}LTA error: ${message}`);
}

/**
 * Handle AI/LLM generation errors.
 */
function handleAiGenerationError(
  message: string,
  attempt: number,
  prefix: string,
): never {
  // Rate limiting - retry after 1 minute
  if (message.includes("429") || message.toLowerCase().includes("rate")) {
    throw new RetryableError(`${prefix}AI rate limited: ${message}`, {
      retryAfter: "1m",
    });
  }

  // Server overload - retry with exponential backoff
  if (
    message.includes("5") &&
    (/\b5\d{2}\b/.test(message) || message.toLowerCase().includes("overload"))
  ) {
    throw new RetryableError(`${prefix}AI server error: ${message}`, {
      retryAfter: attempt ** 2 * 5000,
    });
  }

  // Model errors - longer retry
  if (
    message.toLowerCase().includes("model") ||
    message.toLowerCase().includes("capacity")
  ) {
    throw new RetryableError(`${prefix}AI capacity error: ${message}`, {
      retryAfter: attempt * 30000,
    });
  }

  // Invalid input or auth - don't retry
  if (
    message.toLowerCase().includes("invalid") ||
    message.includes("401") ||
    message.includes("403")
  ) {
    throw new FatalError(`${prefix}AI configuration error: ${message}`);
  }

  // Default: retry with moderate backoff
  throw new RetryableError(`${prefix}AI error: ${message}`, {
    retryAfter: attempt * 10000,
  });
}

/**
 * Handle database errors.
 */
function handleDatabaseError(
  message: string,
  attempt: number,
  prefix: string,
): never {
  // Connection pool exhausted - retry
  if (
    message.toLowerCase().includes("pool") ||
    message.toLowerCase().includes("connection")
  ) {
    throw new RetryableError(`${prefix}Database connection error: ${message}`, {
      retryAfter: attempt * 2000,
    });
  }

  // Timeout - retry
  if (message.toLowerCase().includes("timeout")) {
    throw new RetryableError(`${prefix}Database timeout: ${message}`, {
      retryAfter: attempt * 3000,
    });
  }

  // Constraint violations - don't retry
  if (
    message.toLowerCase().includes("constraint") ||
    message.toLowerCase().includes("duplicate") ||
    message.toLowerCase().includes("unique")
  ) {
    throw new FatalError(`${prefix}Database constraint error: ${message}`);
  }

  // Default: fatal
  throw new FatalError(`${prefix}Database error: ${message}`);
}
