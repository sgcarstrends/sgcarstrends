/**
 * Share-card colour tokens (Satori-compatible hex values).
 *
 * Satori (the library behind next/og) doesn't support CSS variables, so the
 * values from the "Social Images" design comp are written out directly.
 */
export const OG_COLOURS = {
  /** Cream card background */
  background: "#F7F5EF",

  /** Primary ink */
  ink: "#232A2E",

  /** Body copy */
  muted: "#5A6A70",

  /** Labels and captions */
  subtle: "#7B888D",

  /** Axis labels and hairline text */
  faint: "#96A2A7",

  /** Slate-blue accent */
  accent: "#4E7C9B",

  /** Soft accent pill background */
  accentSoft: "#DCE7EC",

  /** Soft accent pill text */
  accentDeep: "#2C5670",

  /** Secondary bar fill */
  accentMuted: "#B9CBD6",

  /** Dividers and bar tracks */
  rule: "#E5E1D5",

  /** White tiles */
  surface: "#FFFFFF",

  /** Tile shadow */
  tileShadow: "0 3px 12px rgba(35,42,46,0.06)",

  /** Delta chip, value went up */
  upBackground: "#FBEBD3",
  upForeground: "#96601C",

  /** Delta chip, value went down */
  downBackground: "#DFF1DF",
  downForeground: "#2F6B3A",

  /** Fuel mix series: petrol, electric, hybrid, diesel */
  fuel: {
    petrol: "#C3CFD5",
    electric: "#4E7C9B",
    hybrid: "#7FAAC4",
    diesel: "#16323F",
  },
} as const;
