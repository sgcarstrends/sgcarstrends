import { vehiclePopulationWorkflow } from "@web/workflows/vehicle-population";
import { start } from "workflow/api";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const run = await start(vehiclePopulationWorkflow, []);

  return Response.json({
    message: "Vehicle population workflow started",
    runId: run.runId,
  });
}
