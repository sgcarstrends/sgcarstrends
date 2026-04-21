"use server";

import { auth } from "@web/app/admin/lib/auth";
import { headers } from "next/headers";
import * as z from "zod";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export interface SendMagicLinkState {
  errors?: {
    email?: string[];
  };
  success?: boolean;
  email?: string;
}

export async function sendMagicLink(
  prevState: SendMagicLinkState,
  formData: FormData,
): Promise<SendMagicLinkState> {
  const validatedFields = emailSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  try {
    await auth.api.signInMagicLink({
      headers: await headers(),
      body: {
        email,
        callbackURL: "/",
      },
    });

    return {
      success: true,
      email,
    };
  } catch {
    return {
      errors: {
        email: ["Failed to send magic link. Please try again."],
      },
    };
  }
}
