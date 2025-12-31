import { client, receiver } from "@web/config/qstash";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("Upstash-Signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing QStash signature" },
      { status: 401 },
    );
  }

  const body = await request.text();
  const isValid = await receiver
    .verify({ signature, body })
    .catch((err: Error) => {
      console.error("[verifyQStash] Verify error:", err.message);
      return false;
    });

  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid QStash signature" },
      { status: 401 },
    );
  }

  try {
    const endpoints = ["cars", "coe", "deregistrations"];
    const results = await client.trigger(
      endpoints.map((endpoint) => ({
        url: `${request.nextUrl.origin}/api/workflows/${endpoint}`,
      })),
    );

    return NextResponse.json({
      success: true,
      message: "Workflows triggered successfully",
      workflowRunIds: results.map(({ workflowRunId }) => workflowRunId),
    });
  } catch (error) {
    console.error("[trigger] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to trigger workflows",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
