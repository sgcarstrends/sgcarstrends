import { deregistrationsWorkflow } from "@web/workflows/deregistrations";
import { start } from "workflow/api";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const run = await start(deregistrationsWorkflow, [{}]);

  return Response.json({
    message: "Deregistrations workflow started",
    runId: run.runId,
  });
}
