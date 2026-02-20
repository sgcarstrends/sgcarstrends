import { OG_COLOURS, OG_NAVY_GRADIENT } from "../colours";
import { OG_CONFIG } from "../config";
import { Layout } from "./layout";

interface ArticleProps {
  /** Eyebrow text displayed in chip (e.g., "Blog") */
  eyebrow: string;
  /** Blog post title */
  title: string;
}

/**
 * Article template for blog post OG images
 *
 * Vercel-style clean layout: eyebrow chip, title with navy gradient, branding
 */
export function Article({ eyebrow, title }: ArticleProps) {
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

      {/* Title */}
      <div
        style={{
          display: "flex",
          fontSize: 52,
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.025em",
          backgroundImage: OG_NAVY_GRADIENT,
          backgroundClip: "text",
          color: "transparent",
          maxWidth: "90%",
        }}
      >
        {title}
      </div>

      {/* Branding */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 100,
          fontSize: 18,
          fontWeight: 500,
          color: OG_COLOURS.mutedForeground,
          letterSpacing: "0.025em",
        }}
      >
        {OG_CONFIG.siteUrl}
      </div>
    </Layout>
  );
}
