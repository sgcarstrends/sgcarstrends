"use client";

import { addToast } from "@heroui/toast";
import { useRealtime } from "@upstash/realtime/client";

type WorkflowType = "cars" | "coe" | "deregistrations";

interface WorkflowEvent {
  workflow: WorkflowType;
  message: string;
  recordsProcessed?: number;
  month?: string;
  error?: string;
}

const WORKFLOW_LABELS: Record<WorkflowType, string> = {
  cars: "Car Registrations",
  coe: "COE Results",
  deregistrations: "Deregistrations",
};

export function Notifications() {
  useRealtime({
    events: ["workflow.completed", "workflow.failed"],
    onData({ event, data }: { event: string; data: WorkflowEvent }) {
      const label = WORKFLOW_LABELS[data.workflow];

      if (event === "workflow.completed") {
        addToast({
          title: `${label} Updated`,
          description: data.message,
          color: "success",
        });
        if (Notification.permission === "granted") {
          new Notification(`${label} Updated`, { body: data.message });
        }
      } else {
        addToast({
          title: `${label} Failed`,
          description: data.error || data.message,
          color: "danger",
        });
        if (Notification.permission === "granted") {
          new Notification(`${label} Failed`, {
            body: data.error || data.message,
          });
        }
      }
    },
  });

  return null;
}
