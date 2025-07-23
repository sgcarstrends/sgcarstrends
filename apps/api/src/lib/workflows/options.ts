import { receiver } from "@api/config/qstash";
import type { PublicServeOptions } from "@upstash/workflow";
import { Resource } from "sst";

export const options: PublicServeOptions = {
  receiver,
  onError: async (error) => {
    const payload = {
      embeds: [
        {
          title: "❌ Upstash Workflow Failed",
          color: 0xff0000,
          fields: [
            {
              name: "Error Type",
              value: error.name ?? "Unknown",
              inline: true,
            },
            {
              name: "Status",
              value: "Failed",
              inline: true,
            },
            {
              name: "Error Cause",
              value: error.cause ?? "Unknown",
              inline: true,
            },
            {
              name: "Error Message",
              value: error.message?.slice(0, 1000) ?? "Unknown",
            },
            {
              name: "Stack Trace",
              value: error.stack?.slice(0, 1000) ?? "Unknown",
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };

    console.log(payload);

    try {
      await fetch(process.env.DISCORD_WORKFLOW_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to send Discord log:", error);
    }
  },
};
