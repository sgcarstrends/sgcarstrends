import { getDeregistrations } from "@web/queries/deregistrations";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getDeregistrations();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching deregistrations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch deregistrations", data: null },
      { status: 500 },
    );
  }
}
