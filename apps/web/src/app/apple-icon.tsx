import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/* The open two-tone mark on the cream canvas. iOS fills transparency with
   black and applies its own corner mask, so the ground is opaque and square. */
export default function AppleIcon() {
  return new ImageResponse(
    <svg
      fill="none"
      height={size.height}
      viewBox="0 0 64 64"
      width={size.width}
    >
      <title>MotorMetrics</title>
      <rect fill="#F7F5EF" height="64" width="64" />
      <path
        d="M8 50 V30 a12 12 0 0 1 24 0 V50"
        stroke="#16323F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7"
      />
      <path
        d="M32 50 V30 a12 12 0 0 1 24 0 V50"
        stroke="#4E7C9B"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="7"
      />
    </svg>,
    size,
  );
}
