import { getBypassHeaders, qstashClient, receiver } from "@web/config/qstash";

export const options = {
  receiver,
  qstashClient,
  headers: getBypassHeaders(),
  onError: async (error: Error) => {
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
      const webhookUrl = process.env.DISCORD_WEBHOOK_URL as string;

      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Failed to send Discord log:", error);
    }
  },
};
