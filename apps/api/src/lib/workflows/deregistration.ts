import { realtime } from "@api/config/realtime";
import { getDeregistrationsLatestMonth } from "@api/features/deregistrations/queries";
import { options } from "@api/lib/workflows/options";
import {
  processTask,
  revalidateCache,
  type WorkflowStep,
} from "@api/lib/workflows/steps";
import { updateDeregistration } from "@api/lib/workflows/update-deregistration";
import { createWorkflow } from "@upstash/workflow/hono";

export const deregistrationWorkflow = createWorkflow(
  async (context) => {
    const tasks: WorkflowStep[] = [
      { name: "deregistrations", handler: updateDeregistration },
    ];

    const results = await Promise.all(
      tasks.map(({ name, handler }) => processTask(context, name, handler)),
    );

    const processedResults = results.filter(
      ({ recordsProcessed }) => recordsProcessed > 0,
    );

    if (processedResults.length === 0) {
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
  },
  { ...options },
);
