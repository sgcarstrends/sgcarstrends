"use server";

import { campaigns, db, eq } from "@sgcarstrends/database";
import { auth } from "@web/app/admin/lib/auth";
import { type PlanKey } from "@web/app/(partners)/lib/plans";
import { getPaymentUrl } from "@web/app/(partners)/lib/stripe";
import { getAdvertiserByUserId } from "@web/app/(partners)/queries/advertiser";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import * as z from "zod";

// TODO: Extract Zod schemas to a shared location
const placementTypes = ["floating-banner", "pinned-card", "in-feed"] as const;
const campaignPlans = ["starter", "growth", "premium"] as const;

const createCampaignInput = z.object({
  name: z
    .string()
    .min(3, "Campaign name must be at least 3 characters")
    .max(100, "Campaign name must be less than 100 characters"),
  placementType: z.enum(placementTypes, {
    message: "Please select a placement type",
  }),
  destinationUrl: z
    .string()
    .url("Please enter a valid URL")
    .refine(
      (url) => url.startsWith("https://"),
      "URL must use HTTPS for security",
    ),
  altText: z
    .string()
    .max(200, "Alt text must be less than 200 characters")
    .optional(),
  plan: z.enum(campaignPlans, {
    message: "Please select a plan",
  }),
  startDate: z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid start date"),
  endDate: z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), "Invalid end date"),
});

export interface CampaignActionState {
  errors?: {
    name?: string[];
    placementType?: string[];
    destinationUrl?: string[];
    altText?: string[];
    plan?: string[];
    startDate?: string[];
    endDate?: string[];
    imageUrl?: string[];
    _form?: string[];
  };
  success?: boolean;
  campaignId?: string;
  paymentUrl?: string;
}

export async function createCampaign(
  prevState: CampaignActionState,
  formData: FormData,
): Promise<CampaignActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      errors: { _form: ["You must be logged in to create a campaign"] },
    };
  }

  const advertiser = await getAdvertiserByUserId(session.user.id);

  if (!advertiser) {
    return {
      errors: { _form: ["Please complete your profile first"] },
    };
  }

  const validatedFields = createCampaignInput.safeParse({
    name: formData.get("name"),
    placementType: formData.get("placementType"),
    destinationUrl: formData.get("destinationUrl"),
    altText: formData.get("altText") || undefined,
    plan: formData.get("plan"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, placementType, destinationUrl, altText, plan, startDate, endDate } =
    validatedFields.data;

  const imageUrl = formData.get("imageUrl") as string;

  if (!imageUrl) {
    return {
      errors: { imageUrl: ["Please upload a creative image"] },
    };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    return {
      errors: { endDate: ["End date must be after start date"] },
    };
  }

  if (start < new Date()) {
    return {
      errors: { startDate: ["Start date cannot be in the past"] },
    };
  }

  try {
    const [campaign] = await db
      .insert(campaigns)
      .values({
        advertiserId: advertiser.id,
        name,
        placementType,
        imageUrl,
        destinationUrl,
        altText: altText || null,
        plan,
        startDate: start,
        endDate: end,
        status: "draft",
      })
      .returning({ id: campaigns.id });

    revalidateTag(`campaigns:advertiser:${advertiser.id}`, "max");
    revalidateTag(`partner:dashboard:${advertiser.id}`, "max");

    const paymentUrl = getPaymentUrl(plan as PlanKey, campaign.id);

    return {
      success: true,
      campaignId: campaign.id,
      paymentUrl,
    };
  } catch {
    return {
      errors: { _form: ["Failed to create campaign. Please try again."] },
    };
  }
}

export async function pauseCampaign(campaignId: string): Promise<void> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const advertiser = await getAdvertiserByUserId(session.user.id);

  if (!advertiser) {
    throw new Error("Advertiser not found");
  }

  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1);

  if (!campaign || campaign.advertiserId !== advertiser.id) {
    throw new Error("Campaign not found");
  }

  await db
    .update(campaigns)
    .set({ status: "paused" })
    .where(eq(campaigns.id, campaignId));

  revalidateTag(`campaign:${campaignId}`, "max");
  revalidateTag(`campaigns:advertiser:${advertiser.id}`, "max");
  revalidateTag(`partner:dashboard:${advertiser.id}`, "max");
  revalidateTag(`ads:${campaign.placementType}`, "max");

  redirect(`/campaigns/${campaignId}`);
}

export async function resumeCampaign(campaignId: string): Promise<void> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const advertiser = await getAdvertiserByUserId(session.user.id);

  if (!advertiser) {
    throw new Error("Advertiser not found");
  }

  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1);

  if (!campaign || campaign.advertiserId !== advertiser.id) {
    throw new Error("Campaign not found");
  }

  await db
    .update(campaigns)
    .set({ status: "active" })
    .where(eq(campaigns.id, campaignId));

  revalidateTag(`campaign:${campaignId}`, "max");
  revalidateTag(`campaigns:advertiser:${advertiser.id}`, "max");
  revalidateTag(`partner:dashboard:${advertiser.id}`, "max");
  revalidateTag(`ads:${campaign.placementType}`, "max");

  redirect(`/campaigns/${campaignId}`);
}
