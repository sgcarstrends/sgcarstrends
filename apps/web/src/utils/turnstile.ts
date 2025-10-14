"use server";

import { z } from "zod";

const turnstileResponseSchema = z.object({
  success: z.boolean(),
  "error-codes": z.array(z.string()).optional(),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
});

export type TurnstileResponse = z.infer<typeof turnstileResponseSchema>;

/**
 * Verifies a Cloudflare Turnstile token with the Siteverify API
 * @param token - The Turnstile response token from the client
 * @returns Promise resolving to verification result
 * @throws Error if TURNSTILE_SECRET_KEY is not configured
 */
export const verifyTurnstileToken = async (
  token: string,
): Promise<TurnstileResponse> => {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("TURNSTILE_SECRET_KEY is not configured");
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(
        `Turnstile verification failed with status: ${response.status}`,
      );
    }

    const data = await response.json();
    return turnstileResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid Turnstile response format: ${error.message}`);
    }
    throw error;
  }
};
