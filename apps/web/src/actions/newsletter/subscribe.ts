"use server";

import { resend } from "@web/utils/resend";

export const subscribeAction = async (formData: FormData) => {
  const email = formData.get("email") as string;

  return resend.contacts.create({
    email,
    audienceId: process.env.RESEND_AUDIENCE_ID as string,
  });
};
