import { NextResponse } from "next/server";

export const GET = async () =>
  NextResponse.redirect("https://twitter.com/sgcarstrends", 301);
