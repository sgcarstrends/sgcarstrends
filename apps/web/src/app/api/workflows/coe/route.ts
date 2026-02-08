import { isValidMonth } from "@web/utils/validate-month";
import { coeWorkflow } from "@web/workflows/coe";
import { start } from "workflow/api";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));

  if (payload.month && !isValidMonth(payload.month)) {
    return Response.json(
      { success: false, message: "Invalid month format. Expected YYYY-MM." },
      { status: 400 },
    );
  }

  const run = await start(coeWorkflow, [payload]);

  return Response.json({
    message: "COE workflow started",
    runId: run.runId,
  });
}
