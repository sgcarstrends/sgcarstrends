import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/* PNG fallback for browsers that ignore SVG favicons (Safari). Light-only;
   icon0.svg carries the dark-mode swap to white + accent-on-dark. */
export default function Icon() {
  return new ImageResponse(
    <svg
      fill="none"
      height={size.height}
      viewBox="0 0 64 64"
      width={size.width}
    >
      <title>MotorMetrics</title>
      <path
        d="M8 50 V30 a12 12 0 0 1 24 0 V50"
        stroke="#16323F"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <path
        d="M32 50 V30 a12 12 0 0 1 24 0 V50"
        stroke="#4E7C9B"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
    </svg>,
    size,
  );
}
