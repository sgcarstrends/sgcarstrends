import { NextResponse } from "next/server";

export const GET = async () => {
  const url = new URL("https://instagram.com/sgcarstrends");
  url.searchParams.set("utm_source", "sgcarstrends");
  url.searchParams.set("utm_medium", "social_redirect");
  url.searchParams.set("utm_campaign", "instagram_profile");

  return NextResponse.redirect(url.toString(), 301);
};
