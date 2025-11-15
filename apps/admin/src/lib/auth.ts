import { db } from "@sgcarstrends/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, oAuthProxy } from "better-auth/plugins";
import * as schema from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  plugins: [
    admin(),
    oAuthProxy(),
    nextCookies(), // Make sure this is the last plugin in the array
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: `${process.env.VERCEL_PROJECT_PRODUCTION_URL}/api/auth/callback/google`,
      disableSignUp: true,
    },
  },
});
