import { subscribeInputSchema } from "@api/config/newsletter/schema";
import {
  NewsletterAlreadySubscribedError,
  NewsletterConfigError,
  NewsletterSubscriptionError,
  subscribeToNewsletter,
} from "@api/features/newsletter";
import { publicProcedure, router } from "@api/trpc";
import { TRPCError } from "@trpc/server";

export const newsletterRouter = router({
  subscribe: publicProcedure
    .input(subscribeInputSchema)
    .mutation(async ({ input }) => {
      try {
        return await subscribeToNewsletter(input.email);
      } catch (error) {
        if (error instanceof NewsletterConfigError) {
          console.error("Newsletter service not configured:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Newsletter service not configured",
          });
        }

        if (error instanceof NewsletterAlreadySubscribedError) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already subscribed",
          });
        }

        if (error instanceof NewsletterSubscriptionError) {
          console.error("Newsletter subscription error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to subscribe to newsletter",
          });
        }

        console.error("Unexpected newsletter subscription error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to subscribe to newsletter",
        });
      }
    }),
});
