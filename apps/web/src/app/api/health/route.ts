import { NextResponse } from "next/server";

/**
 * Lightweight health check endpoint for uptime monitoring
 * Returns a simple JSON response with minimal CPU usage
 */
export const GET = () => {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
};
