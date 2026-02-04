import { getDistinctFuelTypes } from "@web/queries/cars";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getDistinctFuelTypes();

    return NextResponse.json({
      success: true,
      data: data.map((d) => d.fuelType),
    });
  } catch (error) {
    console.error("Error fetching fuel types:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch fuel types", data: null },
      { status: 500 },
    );
  }
}
