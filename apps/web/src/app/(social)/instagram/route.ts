import { NextResponse } from "next/server";

export const GET = async () =>
  NextResponse.redirect("https://instagram.com/sgcarstrends", 301);
