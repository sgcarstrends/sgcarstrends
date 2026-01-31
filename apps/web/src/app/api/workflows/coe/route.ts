import { coeWorkflow } from "@web/workflows/coe";
import { start } from "workflow/api";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));

  const run = await start(coeWorkflow, [payload]);

  return Response.json({
    message: "COE workflow started",
    runId: run.runId,
  });
}
