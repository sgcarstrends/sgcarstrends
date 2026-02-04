import { getCoeResults } from "@web/queries/coe";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getCoeResults();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching COE data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch COE data", data: null },
      { status: 500 },
    );
  }
}
