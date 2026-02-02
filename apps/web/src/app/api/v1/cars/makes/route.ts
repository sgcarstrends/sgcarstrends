import { getDistinctMakes } from "@web/queries/cars";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getDistinctMakes();

    return NextResponse.json({
      success: true,
      data: data.map((d) => d.make),
    });
  } catch (error) {
    console.error("Error fetching makes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch makes", data: null },
      { status: 500 },
    );
  }
}
