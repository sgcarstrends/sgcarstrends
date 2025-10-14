"use server";

import { resend } from "@web/utils/resend";
import { verifyTurnstileToken } from "@web/utils/turnstile";

export const subscribeAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const turnstileToken = formData.get("cf-turnstile-response") as string;

  // Verify Turnstile token
  if (!turnstileToken) {
    return {
      data: null,
      error: { message: "Please complete the verification" },
    };
  }

  try {
    const verification = await verifyTurnstileToken(turnstileToken);

    if (!verification.success) {
      return {
        data: null,
        error: {
          message: "Verification failed. Please try again.",
        },
      };
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return {
      data: null,
      error: {
        message: "Verification error. Please try again.",
      },
    };
  }

  // Proceed with subscription after successful verification
  return resend.contacts.create({
    email,
    audienceId: process.env.RESEND_AUDIENCE_ID as string,
  });
};
