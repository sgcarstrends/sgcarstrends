import { getMakeDetails } from "@web/queries/cars/makes";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ make: string }> },
) {
  const { make } = await params;

  try {
    const month = request.nextUrl.searchParams.get("month") ?? undefined;
    const data = await getMakeDetails(make, month);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching make details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch make details", data: null },
      { status: 500 },
    );
  }
}
