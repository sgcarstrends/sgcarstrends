import { NextResponse } from "next/server";

export const GET = async () =>
  NextResponse.redirect("https://t.me/sgcarstrends", 301);
