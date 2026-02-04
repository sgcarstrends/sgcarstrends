import { carsWorkflow } from "@web/workflows/cars";
import { start } from "workflow/api";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));

  const run = await start(carsWorkflow, [payload]);

  return Response.json({
    message: "Cars workflow started",
    runId: run.runId,
  });
}
