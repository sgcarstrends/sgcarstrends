import { stripeClient } from "@better-auth/stripe/client";
import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    stripeClient({
      subscription: true,
    }),
  ],
});
