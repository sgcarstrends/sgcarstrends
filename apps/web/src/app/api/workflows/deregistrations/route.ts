import { serve } from "@upstash/workflow/nextjs";
import { deregistrationWorkflow } from "@web/lib/workflows/deregistration";
import { options } from "@web/lib/workflows/options";
import type { DeregistrationWorkflowPayload } from "@web/lib/workflows/types";

export const { POST } = serve<DeregistrationWorkflowPayload>(
  deregistrationWorkflow,
  options,
);
