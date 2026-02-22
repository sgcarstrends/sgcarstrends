import { carPopulationWorkflow } from "@web/workflows/car-population";
import { start } from "workflow/api";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const run = await start(carPopulationWorkflow, []);

  return Response.json({
    message: "Car population workflow started",
    runId: run.runId,
  });
}
