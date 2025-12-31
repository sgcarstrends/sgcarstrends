import { serve } from "@upstash/workflow/nextjs";
import { coeWorkflow } from "@web/lib/workflows/coe";
import { options } from "@web/lib/workflows/options";

export const { POST } = serve(coeWorkflow, options);
