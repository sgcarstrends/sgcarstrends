import { NextResponse } from "next/server";

export const GET = () => {
  const url = new URL("https://discord.com/invite/xxtQueEqt6");
  url.searchParams.set("utm_source", "sgcarstrends");
  url.searchParams.set("utm_medium", "social_redirect");
  url.searchParams.set("utm_campaign", "discord_profile");

  return NextResponse.redirect(url.toString(), 301);
};
