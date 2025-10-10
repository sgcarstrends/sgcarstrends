import { resend } from "@api/config/resend";
import {
  NewsletterAlreadySubscribedError,
  NewsletterConfigError,
  NewsletterSubscriptionError,
  type NewsletterSubscriptionResult,
} from "./models";

const isAlreadySubscribedError = (message?: string | null) => {
  return Boolean(message?.toLowerCase().includes("already"));
};

export const subscribeToNewsletter = async (
  email: string,
): Promise<NewsletterSubscriptionResult> => {
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!audienceId) {
    throw new NewsletterConfigError(
      "Newsletter service not configured (missing audience id)",
    );
  }

  try {
    const response = await resend.contacts.create({
      email,
      audienceId,
    });

    if (response.error) {
      if (isAlreadySubscribedError(response.error.message)) {
        throw new NewsletterAlreadySubscribedError();
      }

      throw new NewsletterSubscriptionError(response.error.message);
    }

    return {
      success: true,
      message: "Successfully subscribed to newsletter",
    };
  } catch (error) {
    if (error instanceof NewsletterAlreadySubscribedError) {
      throw error;
    }

    if (error instanceof NewsletterConfigError) {
      throw error;
    }

    if (error instanceof NewsletterSubscriptionError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : String(error);

    throw new NewsletterSubscriptionError(message);
  }
};
