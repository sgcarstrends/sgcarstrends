import { getLatestCoeResults } from "@web/queries/coe";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getLatestCoeResults();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching latest COE:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch latest COE", data: null },
      { status: 500 },
    );
  }
}
