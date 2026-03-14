import { NextResponse } from "next/server";

export function validateApiToken(request: Request): NextResponse | null {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  const apiToken =
    process.env.MOTORMETRICS_API_TOKEN ?? process.env.SG_CARS_TRENDS_API_TOKEN;

  if (!token || token !== apiToken) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  return null;
}
