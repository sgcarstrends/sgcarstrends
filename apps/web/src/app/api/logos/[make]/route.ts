import { getLogo } from "@logos/services/blob";
import { downloadLogo } from "@logos/services/scraper";
import { type NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ make: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { make } = await params;

  try {
    let logo = await getLogo(make);

    if (!logo) {
      const result = await downloadLogo(make);

      if (!result.success || !result.logo) {
        return NextResponse.json(
          {
            success: false,
            error: result.error || "Logo not found",
            make,
          },
          { status: 404 },
        );
      }
      logo = result.logo;
    }

    return NextResponse.json({
      success: true,
      logo,
    });
  } catch (error) {
    console.error(`Error fetching logo for ${make}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while fetching logo",
        make,
      },
      { status: 500 },
    );
  }
}
