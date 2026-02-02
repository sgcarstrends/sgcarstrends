import { getCarsMonths } from "@web/queries/cars";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getCarsMonths();

    return NextResponse.json({
      success: true,
      data: data.map((d) => d.month),
    });
  } catch (error) {
    console.error("Error fetching months:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch months", data: null },
      { status: 500 },
    );
  }
}
