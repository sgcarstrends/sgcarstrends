import { OG_COLOURS } from "@web/lib/og/colours";

interface DeltaChipProps {
  /** Signed change; rendered to one decimal place */
  delta: number;
  /** Suffix after the number, `%` by default */
  unit?: string;
  size?: "sm" | "lg";
}

/** Formats a signed change the way the cards print it, e.g. `−1.2%` */
export function formatDelta(delta: number, unit = "%"): string {
  const sign = delta >= 0 ? "+" : "−";

  return `${sign}${Math.abs(delta).toFixed(1)}${unit}`;
}

/** Amber chip for a rise, green chip for a fall */
export function DeltaChip({ delta, unit = "%", size = "sm" }: DeltaChipProps) {
  const up = delta >= 0;
  const large = size === "lg";

  return (
    <span
      style={{
        alignSelf: "flex-start",
        borderRadius: 999,
        padding: large ? "10px 20px" : "6px 12px",
        fontSize: large ? 26 : 18,
        fontWeight: 800,
        whiteSpace: "nowrap",
        backgroundColor: up
          ? OG_COLOURS.upBackground
          : OG_COLOURS.downBackground,
        color: up ? OG_COLOURS.upForeground : OG_COLOURS.downForeground,
      }}
    >
      {formatDelta(delta, unit)}
    </span>
  );
}
