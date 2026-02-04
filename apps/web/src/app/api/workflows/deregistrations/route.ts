import { deregistrationsWorkflow } from "@web/workflows/deregistrations";
import { start } from "workflow/api";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));

  const run = await start(deregistrationsWorkflow, [payload]);

  return Response.json({
    message: "Deregistrations workflow started",
    runId: run.runId,
  });
}
