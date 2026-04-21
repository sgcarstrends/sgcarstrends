"use server";

import { advertisers, db, eq } from "@sgcarstrends/database";
import { auth } from "@web/app/admin/lib/auth";
import { getAdvertiserByUserId } from "@web/app/partners/queries/advertiser";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";
import * as z from "zod";

const profileInput = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  contactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(100, "Contact name must be less than 100 characters"),
  contactEmail: z.string().email("Please enter a valid email address"),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export interface ProfileActionState {
  errors?: {
    companyName?: string[];
    contactName?: string[];
    contactEmail?: string[];
    website?: string[];
    _form?: string[];
  };
  success?: boolean;
}

export async function updateProfile(
  prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      errors: { _form: ["You must be logged in"] },
    };
  }

  const validatedFields = profileInput.safeParse({
    companyName: formData.get("companyName"),
    contactName: formData.get("contactName"),
    contactEmail: formData.get("contactEmail"),
    website: formData.get("website") || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { companyName, contactName, contactEmail, website } = validatedFields.data;

  try {
    const existingAdvertiser = await getAdvertiserByUserId(session.user.id);

    if (existingAdvertiser) {
      await db
        .update(advertisers)
        .set({
          companyName,
          contactName,
          contactEmail,
          website: website || null,
        })
        .where(eq(advertisers.id, existingAdvertiser.id));

      revalidateTag(`advertiser:${existingAdvertiser.id}`, "max");
      revalidateTag(`advertiser:user:${session.user.id}`, "max");
    } else {
      await db.insert(advertisers).values({
        userId: session.user.id,
        companyName,
        contactName,
        contactEmail,
        website: website || null,
      });

      revalidateTag(`advertiser:user:${session.user.id}`, "max");
    }

    return { success: true };
  } catch {
    return {
      errors: { _form: ["Failed to save profile. Please try again."] },
    };
  }
}
