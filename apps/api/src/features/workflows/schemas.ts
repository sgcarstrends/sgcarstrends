import { z } from "@hono/zod-openapi";

// Workflow response schemas
export const WorkflowTriggerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  workflowRunIds: z.array(z.string()).optional(),
  error: z.string().optional(),
});

export const WorkflowExecutionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  error: z.string().optional(),
});

// Type exports
export type WorkflowTriggerResponse = z.infer<
  typeof WorkflowTriggerResponseSchema
>;
export type WorkflowExecutionResponse = z.infer<
  typeof WorkflowExecutionResponseSchema
>;
