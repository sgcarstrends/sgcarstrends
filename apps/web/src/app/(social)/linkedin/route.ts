import { NextResponse } from "next/server";

export const GET = async () =>
  NextResponse.redirect("https://linkedin.com/company/sgcarstrends", 301);
