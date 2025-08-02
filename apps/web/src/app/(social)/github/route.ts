import { NextResponse } from "next/server";

export const GET = async () =>
  NextResponse.redirect("https://github.com/sgcarstrends", 301);
