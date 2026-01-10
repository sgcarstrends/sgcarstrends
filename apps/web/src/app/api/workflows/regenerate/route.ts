import { serve } from "@upstash/workflow/nextjs";
import { options } from "@web/lib/workflows/options";
import { regenerationWorkflow } from "@web/lib/workflows/regeneration";
import type { RegenerationPayload } from "@web/lib/workflows/types";

export const { POST } = serve<RegenerationPayload>(
  regenerationWorkflow,
  options,
);
