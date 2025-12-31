import { serve } from "@upstash/workflow/nextjs";
import { deregistrationWorkflow } from "@web/lib/workflows/deregistration";
import { options } from "@web/lib/workflows/options";

export const { POST } = serve(deregistrationWorkflow, options);
