import { listLogos } from "@logos/services/blob";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const logos = await listLogos();

    return NextResponse.json({
      success: true,
      count: logos.length,
      logos,
    });
  } catch (error) {
    console.error("Error listing logos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while listing logos",
      },
      { status: 500 },
    );
  }
}
