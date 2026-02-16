import { isValidMonth } from "@sgcarstrends/utils";
import { deregistrationsWorkflow } from "@web/workflows/deregistrations";
import { start } from "workflow/api";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));

  if (payload.month && !isValidMonth(payload.month)) {
    return Response.json(
      { success: false, message: "Invalid month format. Expected YYYY-MM." },
      { status: 400 },
    );
  }

  const run = await start(deregistrationsWorkflow, [payload]);

  return Response.json({
    message: "Deregistrations workflow started",
    runId: run.runId,
  });
}
