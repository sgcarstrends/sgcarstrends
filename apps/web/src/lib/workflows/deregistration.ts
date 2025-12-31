import type { WorkflowContext } from "@upstash/workflow";
import { realtime } from "@web/config/realtime";
import { processTask, revalidateCache } from "@web/lib/workflows/steps";
import { updateDeregistration } from "@web/lib/workflows/update-deregistration";
import { getDeregistrationsLatestMonth } from "@web/queries/deregistrations/latest-month";

export async function deregistrationWorkflow(context: WorkflowContext) {
  const result = await processTask(
    context,
    "deregistrations",
    updateDeregistration,
  );

  if (result.recordsProcessed === 0) {
    return {
      message: "No deregistration records processed.",
    };
  }

  const { month } = await getDeregistrationsLatestMonth();

  if (!month) {
    return {
      message: "No deregistration data found.",
    };
  }

  await revalidateCache(context, [
    `deregistrations:month:${month}`,
    "deregistrations:months",
  ]);

  await context.run("send-notification", async () => {
    await realtime.emit("workflow.completed", {
      workflow: "deregistrations",
      message: `Deregistrations updated for ${month}`,
      month,
    });
  });

  return {
    message: "[DEREGISTRATIONS] Data processed and published successfully",
  };
}
