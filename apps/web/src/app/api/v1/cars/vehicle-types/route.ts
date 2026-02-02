import { getDistinctVehicleTypes } from "@web/queries/cars";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getDistinctVehicleTypes();

    return NextResponse.json({
      success: true,
      data: data.map((d) => d.vehicleType),
    });
  } catch (error) {
    console.error("Error fetching vehicle types:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vehicle types", data: null },
      { status: 500 },
    );
  }
}
