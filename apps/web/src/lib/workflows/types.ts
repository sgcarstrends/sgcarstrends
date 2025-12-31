/**
 * Workflow payload types for type-safe request payloads.
 *
 * These types are used with Upstash Workflow's `serve<T>()` generic
 * to provide type safety for `context.requestPayload`.
 */

/**
 * Payload for cars workflow - triggered without body data.
 * Can be extended in future to support specific month/year targeting.
 */
export interface CarsWorkflowPayload {
  /** Optional: Specific month to process (e.g., "2024-01") */
  month?: string;
}

/**
 * Payload for COE workflow - triggered without body data.
 * Can be extended in future to support specific month/bidding targeting.
 */
export interface CoeWorkflowPayload {
  /** Optional: Specific month to process (e.g., "2024-01") */
  month?: string;
}

/**
 * Payload for deregistration workflow - triggered without body data.
 * Can be extended in future to support specific month targeting.
 */
export interface DeregistrationWorkflowPayload {
  /** Optional: Specific month to process (e.g., "2024-01") */
  month?: string;
}

/**
 * Payload for blog post regeneration workflow.
 */
export interface RegenerationPayload {
  /** Month to regenerate post for (e.g., "2024-01") */
  month: string;
  /** Type of data to regenerate */
  dataType: "cars" | "coe";
}
