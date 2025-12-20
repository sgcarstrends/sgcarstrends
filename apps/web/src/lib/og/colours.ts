/**
 * OG image colour tokens (Satori-compatible hex values)
 *
 * Satori (the library behind next/og) doesn't support CSS variables,
 * so we define hex values directly.
 *
 * @see CLAUDE.md Colour System section for design tokens
 */
export const OG_COLOURS = {
  /** Navy Blue - primary brand colour */
  primary: "#191970",

  /** Light background */
  background: "#f5f5f5",

  /** Dark text */
  foreground: "#0a0a0a",

  /** Muted text (70% opacity equivalent) */
  mutedForeground: "rgba(10, 10, 10, 0.7)",

  /** Subtle text (90% opacity equivalent) */
  subtleForeground: "rgba(10, 10, 10, 0.9)",

  /** Chip background */
  chipBackground: "rgba(25, 25, 112, 0.05)",

  /** Chip border */
  chipBorder: "rgba(25, 25, 112, 0.2)",
} as const;

/**
 * CSS gradient string for Navy Blue gradient text
 */
export const OG_NAVY_GRADIENT =
  "linear-gradient(to right, #191970, rgba(25, 25, 112, 0.7))";
