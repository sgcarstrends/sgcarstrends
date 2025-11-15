import { NEWSLETTER_FROM_EMAIL, resend } from "@api/config/resend";
import { createMonthlyNewsletterContent } from "@api/features/newsletter/audience-service";
import { options } from "@api/lib/workflows/options";
import { createWorkflow } from "@upstash/workflow/hono";

export const newsletterWorkflow = createWorkflow(
  async (context) => {
    return context.run("Send monthly newsletter", async () => {
      try {
        const audienceId = process.env.RESEND_AUDIENCE_ID;

        if (!audienceId) {
          console.error(
            "[NEWSLETTER_WORKFLOW] RESEND_AUDIENCE_ID not configured",
          );
          return {
            success: false,
            message: "Audience ID not configured for newsletter broadcast",
          };
        }

        const content = createMonthlyNewsletterContent();

        console.log(
          "[NEWSLETTER_WORKFLOW] Creating newsletter broadcast for month:",
          content.month,
        );

        const createResponse = await resend.broadcasts.create({
          audienceId,
          from: NEWSLETTER_FROM_EMAIL,
          subject: content.subject,
          text: content.text,
          name: content.name,
        });

        if (createResponse.error) {
          const errorMessage = createResponse.error.message;

          console.error(
            "[NEWSLETTER_WORKFLOW] Error creating newsletter broadcast:",
            createResponse.error,
          );
          return {
            success: false,
            message: "Failed to create newsletter broadcast",
            error: errorMessage,
          };
        }

        const broadcastId = createResponse.data?.id;

        if (!broadcastId) {
          console.error(
            "[NEWSLETTER_WORKFLOW] Missing broadcast ID after creation",
          );
          return {
            success: false,
            message: "Broadcast created but missing identifier",
          };
        }

        console.log(
          `[NEWSLETTER_WORKFLOW] Broadcast created successfully - Broadcast ID: ${broadcastId}`,
        );

        const sendResponse = await resend.broadcasts.send(broadcastId);

        if (sendResponse.error) {
          const errorMessage = sendResponse.error.message;

          console.error(
            "[NEWSLETTER_WORKFLOW] Error sending newly created broadcast:",
            sendResponse.error,
          );
          return {
            success: false,
            message: "Failed to send newsletter broadcast",
            error: errorMessage,
            broadcastId,
          };
        }

        const sendId = sendResponse.data?.id;

        console.log(
          `[NEWSLETTER_WORKFLOW] Newsletter broadcast created and sent successfully - Send ID: ${sendId}`,
        );

        return {
          success: true,
          message: "Newsletter broadcast created and sent successfully",
          sendId,
          broadcastId,
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : error;
        console.error(
          "[NEWSLETTER_WORKFLOW] Newsletter workflow error:",
          error,
        );
        return {
          success: false,
          message: "Failed to process newsletter broadcast",
          error: errorMessage,
        };
      }
    });
  },
  { ...options },
);
