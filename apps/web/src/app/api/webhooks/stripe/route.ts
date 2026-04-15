import { campaigns, db, eq } from "@sgcarstrends/database";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@web/app/(partners)/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const campaignId = session.client_reference_id;

    if (campaignId) {
      const [campaign] = await db
        .update(campaigns)
        .set({ status: "active" })
        .where(eq(campaigns.id, campaignId))
        .returning({ advertiserId: campaigns.advertiserId });

      if (campaign) {
        revalidateTag(`campaign:${campaignId}`, "max");
        revalidateTag(`campaigns:advertiser:${campaign.advertiserId}`, "max");
        revalidateTag(`partner:dashboard:${campaign.advertiserId}`, "max");
        revalidateTag(`ads:placement`, "max");
      }
    }
  }

  return NextResponse.json({ received: true });
}
