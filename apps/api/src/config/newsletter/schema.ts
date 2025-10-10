import { z } from "zod";

export const subscribeInputSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type SubscribeInput = z.infer<typeof subscribeInputSchema>;
