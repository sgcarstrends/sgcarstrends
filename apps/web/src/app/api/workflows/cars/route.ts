import { serve } from "@upstash/workflow/nextjs";
import { carsWorkflow } from "@web/lib/workflows/cars";
import { options } from "@web/lib/workflows/options";

export const { POST } = serve(carsWorkflow, options);
