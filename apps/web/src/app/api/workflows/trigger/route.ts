import { carsWorkflow } from "@web/workflows/cars";
import { coeWorkflow } from "@web/workflows/coe";
import { deregistrationsWorkflow } from "@web/workflows/deregistrations";
import { start } from "workflow/api";

/**
 * Manual trigger endpoint for all workflows.
 * With Vercel Cron, each workflow is triggered directly via its own endpoint.
 * This endpoint is kept for manual triggering or testing purposes.
 */
export async function POST() {
  try {
    const [carsRun, coeRun, deregistrationsRun] = await Promise.all([
      start(carsWorkflow, [{}]),
      start(coeWorkflow, [{}]),
      start(deregistrationsWorkflow, [{}]),
    ]);

    return Response.json({
      success: true,
      message: "All workflows triggered successfully",
      runs: {
        cars: carsRun.runId,
        coe: coeRun.runId,
        deregistrations: deregistrationsRun.runId,
      },
    });
  } catch (error) {
    console.error("[trigger] Error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to trigger workflows",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
