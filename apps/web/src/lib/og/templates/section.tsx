import { OG_COLOURS, OG_NAVY_GRADIENT } from "../colours";
import { Layout } from "./layout";

interface SectionProps {
  /** Eyebrow text displayed in chip */
  eyebrow: string;
  /** First line of headline */
  headlineTop: string;
  /** Second line of headline (with gradient) */
  headlineBottom: string;
  /** Description text below headline */
  description: string;
}

/**
 * Section template for static pages (Dashboard, About, etc.)
 *
 * Features eyebrow chip, two-line headline with gradient, and description
 */
export function Section({
  eyebrow,
  headlineTop,
  headlineBottom,
  description,
}: SectionProps) {
  return (
    <Layout>
      {/* Eyebrow chip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          backgroundColor: OG_COLOURS.chipBackground,
          border: `1px solid ${OG_COLOURS.chipBorder}`,
          borderRadius: 9999,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: OG_COLOURS.primary,
          }}
        />
        <span
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: OG_COLOURS.subtleForeground,
            letterSpacing: "0.025em",
          }}
        >
          {eyebrow}
        </span>
      </div>

      {/* Main headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 64,
          fontWeight: 700,
          color: OG_COLOURS.foreground,
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
          marginBottom: 24,
        }}
      >
        <span>{headlineTop}</span>
        <span
          style={{
            backgroundImage: OG_NAVY_GRADIENT,
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {headlineBottom}
        </span>
      </div>

      {/* Subheadline */}
      <div
        style={{
          display: "flex",
          fontSize: 24,
          color: OG_COLOURS.mutedForeground,
          lineHeight: 1.5,
          maxWidth: 700,
          fontWeight: 400,
        }}
      >
        {description}
      </div>
    </Layout>
  );
}
