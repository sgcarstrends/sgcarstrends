import { getPostsWorkflowRevalidationTags } from "@web/lib/cache-tags";
import { revalidateTag } from "next/cache";
import { FatalError, RetryableError, getWritable } from "workflow";

import type { WorkflowEvent } from "./types";

export type { WorkflowEvent, WorkflowEventType } from "./types";

/**
 * Emit a streaming event from a workflow step.
 * Uses WDK's getWritable() to write progress events for real-time monitoring.
 */
export async function emitEvent(
  event: Omit<WorkflowEvent, "timestamp">,
): Promise<void> {
  "use step";

  const writer = getWritable<WorkflowEvent>().getWriter();
  try {
    await writer.write({ ...event, timestamp: Date.now() });
  } finally {
    writer.releaseLock();
  }
}

/**
 * Revalidate posts cache after publishing.
 */
export async function revalidatePostsCache(): Promise<void> {
  "use step";

  for (const tag of getPostsWorkflowRevalidationTags()) {
    revalidateTag(tag, "max");
  }
  console.log("[WORKFLOW] Posts cache invalidated");
}

/**
 * Handle AI generation errors with appropriate WDK error types.
 * - 429 (rate limit) → RetryableError with 1 minute delay
 * - 401/403 (auth) → FatalError (cannot recover)
 * - Other errors → rethrown as-is
 */
export function handleAIError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("429")) {
    console.log("[WORKFLOW] AI rate limited, scheduling retry in 1m");
    throw new RetryableError("AI rate limited", { retryAfter: "1m" });
  }

  if (message.includes("401") || message.includes("403")) {
    console.log("[WORKFLOW] AI authentication failed");
    throw new FatalError("AI authentication failed");
  }

  throw error;
}
