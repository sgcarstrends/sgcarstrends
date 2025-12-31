import { serve } from "@upstash/workflow/nextjs";
import { coeWorkflow } from "@web/lib/workflows/coe";
import { options } from "@web/lib/workflows/options";
import type { CoeWorkflowPayload } from "@web/lib/workflows/types";

export const { POST } = serve<CoeWorkflowPayload>(coeWorkflow, options);
