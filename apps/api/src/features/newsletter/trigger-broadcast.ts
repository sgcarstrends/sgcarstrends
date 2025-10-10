import crypto from "node:crypto";
import { client } from "@api/config/qstash";
import { WORKFLOWS_BASE_URL } from "@api/config/workflow";
import { NewsletterBroadcastError } from "./models";

interface TriggerNewsletterResult {
  workflowRunId: string;
}

export const triggerNewsletterWorkflow =
  async (): Promise<TriggerNewsletterResult> => {
    try {
      const workflowRunId = crypto.randomUUID();
      const { workflowRunId: triggeredId } = await client.trigger({
        url: `${WORKFLOWS_BASE_URL}/newsletter`,
        headers: {
          "Upstash-Workflow-RunId": workflowRunId,
        },
        workflowRunId,
      });

      if (!triggeredId) {
        throw new NewsletterBroadcastError(
          "Newsletter workflow triggered but missing identifier",
        );
      }

      return {
        workflowRunId: triggeredId,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new NewsletterBroadcastError(message);
    }
  };
