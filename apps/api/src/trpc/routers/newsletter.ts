import { publicProcedure, router } from "@api/trpc";
import { TRPCError } from "@trpc/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeInputSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(subscribeInputSchema)
    .mutation(async ({ input }) => {
      try {
        const { email } = input;

        const audienceId = process.env.RESEND_AUDIENCE_ID;

        if (!audienceId) {
          console.error("RESEND_AUDIENCE_ID not configured");
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Newsletter service not configured",
          });
        }

        const response = await resend.contacts.create({
          email,
          audienceId,
        });

        if (response.error) {
          // Check if contact already exists
          if (response.error.message?.includes("already exists")) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Email already subscribed",
            });
          }

          console.error("Resend error:", response.error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to subscribe to newsletter",
          });
        }

        return {
          success: true,
          message: "Successfully subscribed to newsletter",
        };
      } catch (error) {
        // Re-throw TRPCError instances
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Newsletter subscription error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to subscribe to newsletter",
        });
      }
    }),
});
