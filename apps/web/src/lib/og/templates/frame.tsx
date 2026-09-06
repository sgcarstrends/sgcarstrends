import { OG_COLOURS } from "@web/lib/og/colours";
import { OG_CONFIG } from "@web/lib/og/config";
import type { ReactNode } from "react";

interface FrameProps {
  /** 630 for og:image, 600 for twitter:image */
  height: number;
  /** Right-hand footer label; defaults to the site domain */
  footerLabel?: string;
  children: ReactNode;
}

/**
 * Cream full-bleed card with the shared MotorMetrics footer.
 *
 * Every share card in the design comp ends with the same row: accent circle
 * with a trending-up mark, the wordmark, and a right-aligned label.
 */
export function Frame({
  height,
  footerLabel = OG_CONFIG.siteUrl,
  children,
}: FrameProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: OG_CONFIG.width,
        height,
        padding: "54px 60px",
        backgroundColor: OG_COLOURS.background,
        color: OG_COLOURS.ink,
        fontFamily: OG_CONFIG.fontFamily,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
          marginTop: 28,
          paddingTop: 24,
          borderTop: `2px solid ${OG_COLOURS.rule}`,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 46,
            height: 46,
            borderRadius: "50%",
            backgroundColor: OG_COLOURS.accent,
          }}
        >
          <svg
            role="img"
            aria-label="MotorMetrics"
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 29,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: OG_COLOURS.ink }}>Motor</span>
          <span style={{ color: OG_COLOURS.accent }}>Metrics</span>
        </div>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 23,
            fontWeight: 600,
            color: OG_COLOURS.subtle,
          }}
        >
          {footerLabel}
        </span>
      </div>
    </div>
  );
}
