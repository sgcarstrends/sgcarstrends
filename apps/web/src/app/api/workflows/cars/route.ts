import { serve } from "@upstash/workflow/nextjs";
import { carsWorkflow } from "@web/lib/workflows/cars";
import { options } from "@web/lib/workflows/options";
import type { CarsWorkflowPayload } from "@web/lib/workflows/types";

export const { POST } = serve<CarsWorkflowPayload>(carsWorkflow, options);
