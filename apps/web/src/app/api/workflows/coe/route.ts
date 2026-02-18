import { coeWorkflow } from "@web/workflows/coe";
import { start } from "workflow/api";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const run = await start(coeWorkflow, [{}]);

  return Response.json({ message: "COE workflow started", runId: run.runId });
}
