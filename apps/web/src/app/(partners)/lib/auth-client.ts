import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

export const partnerAuthClient = createAuthClient({
  plugins: [magicLinkClient()],
});
