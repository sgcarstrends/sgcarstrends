import { stripe as stripePlugin } from "@better-auth/stripe";
import * as schema from "@sgcarstrends/database";
import { campaigns, db, eq } from "@sgcarstrends/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, magicLink } from "better-auth/plugins";
import { revalidateTag } from "next/cache";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  trustedOrigins: ["https://*.sgcarstrends.com"],
  advanced: {
    trustedProxyHeaders: true,
    allowedHosts: [
      "sgcarstrends.com",
      "*.sgcarstrends.com",
      "*.vercel.app",
      "localhost:3000",
    ],
  },
  plugins: [
    admin(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail(email, url);
      },
      expiresIn: 60 * 10, // 10 minutes
    }),
    stripePlugin({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "starter",
            priceId: process.env.STRIPE_PRICE_STARTER as string,
          },
          {
            name: "growth",
            priceId: process.env.STRIPE_PRICE_GROWTH as string,
          },
          {
            name: "premium",
            priceId: process.env.STRIPE_PRICE_PREMIUM as string,
          },
        ],
        onSubscriptionComplete: async ({ stripeSubscription }) => {
          const campaignId = stripeSubscription.metadata?.campaignId;
          if (!campaignId) return;

          await db
            .update(campaigns)
            .set({ status: "active" })
            .where(eq(campaigns.id, campaignId));

          revalidateTag(`campaign:${campaignId}`, "max");
        },
      },
    }),
    nextCookies(), // Make sure this is the last plugin in the array
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
