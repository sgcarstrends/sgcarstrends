import { isValidMonth } from "@sgcarstrends/utils";
import { carsWorkflow } from "@web/workflows/cars";
import { start } from "workflow/api";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));

  if (payload.month && !isValidMonth(payload.month)) {
    return Response.json(
      { success: false, message: "Invalid month format. Expected YYYY-MM." },
      { status: 400 },
    );
  }

  const run = await start(carsWorkflow, [payload]);

  return Response.json({
    message: "Cars workflow started",
    runId: run.runId,
  });
}
