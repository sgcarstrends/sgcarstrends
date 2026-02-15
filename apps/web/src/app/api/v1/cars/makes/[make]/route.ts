import { getMakeDetails, getMakeFromSlug } from "@web/queries/cars/makes";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ make: string }> },
) {
  const { make } = await params;

  const exactMake = await getMakeFromSlug(make);
  if (!exactMake) {
    return NextResponse.json(
      { success: false, error: "Make not found", data: null },
      { status: 404 },
    );
  }

  try {
    const month = request.nextUrl.searchParams.get("month");
    const data = await getMakeDetails(exactMake, month);

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
