import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "About SG Cars Trends";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const dynamic = "force-static";

export default async function Image() {
  // Font loading, process.cwd() is Next.js project directory
  const geistBold = await readFile(
    join(process.cwd(), "assets/fonts/Geist-Bold.ttf"),
  );

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        height: "100%",
        backgroundColor: "#f5f5f5",
        fontFamily: "Geist",
        padding: "80px 100px",
        position: "relative",
      }}
    >
      {/* Eyebrow chip - About page indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          backgroundColor: "rgba(37, 99, 235, 0.05)",
          border: "1px solid rgba(37, 99, 235, 0.2)",
          borderRadius: 9999,
          marginBottom: 32,
        }}
      >
        {/* Primary dot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#2563eb",
          }}
        />
        <span
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: "rgba(10, 10, 10, 0.9)",
            letterSpacing: "0.025em",
          }}
        >
          Behind the Data
        </span>
      </div>

      {/* Main headline - About page focused */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 64,
          fontWeight: 700,
          color: "#0a0a0a",
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          marginBottom: 24,
        }}
      >
        <span>The Story Behind</span>
        <span
          style={{
            backgroundImage:
              "linear-gradient(to right, #2563eb, rgba(37, 99, 235, 0.7))",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          SG Cars Trends
        </span>
      </div>

      {/* Subheadline - About page description */}
      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: "rgba(10, 10, 10, 0.7)",
          lineHeight: 1.5,
          maxWidth: 700,
          fontWeight: 400,
        }}
      >
        A platform for exploring Singapore car registration statistics, COE
        bidding results, and market data. Built to make car market information
        easier to find and understand.
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: geistBold,
          style: "normal",
          weight: 700,
        },
      ],
      headers: {
        "Cache-Control":
          "public, max-age=31536000, s-maxage=31536000, immutable",
      },
    },
  );
}
