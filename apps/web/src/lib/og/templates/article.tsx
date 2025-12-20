import { OG_COLOURS } from "../colours";
import { OG_CONFIG } from "../config";

interface ArticleProps {
  title: string;
}

/**
 * Article template for blog post OG images
 *
 * Features centered layout with decorative shapes and Navy Blue accent
 */
export function Article({ title }: ArticleProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#ffffff",
        fontFamily: OG_CONFIG.fontFamily,
      }}
    >
      {/* Decorative shapes */}
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 100,
          width: 200,
          height: 6,
          backgroundColor: "rgba(25, 25, 112, 0.3)",
          borderRadius: "3px",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 80,
          width: 150,
          height: 4,
          backgroundColor: "rgba(25, 25, 112, 0.25)",
          borderRadius: "2px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 50,
          width: 100,
          height: 100,
          backgroundColor: "rgba(25, 25, 112, 0.1)",
          borderRadius: "8px",
        }}
      />

      {/* Content */}
      <div
        style={{
          fontSize: 24,
          color: "#475569",
          marginBottom: 20,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {OG_CONFIG.siteName}
      </div>
      <div
        style={{
          fontSize: 48,
          color: OG_COLOURS.foreground,
          textAlign: "center",
          lineHeight: 1.2,
          maxWidth: "80%",
          marginBottom: 30,
        }}
      >
        {title}
      </div>

      {/* Navy Blue line at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 8,
          backgroundColor: OG_COLOURS.primary,
        }}
      />
    </div>
  );
}
