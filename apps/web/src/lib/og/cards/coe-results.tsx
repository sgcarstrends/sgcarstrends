import { OG_COLOURS } from "../colours";
import { DeltaChip } from "../templates/delta-chip";
import { Frame } from "../templates/frame";
import { Pill } from "../templates/pill";
import { StatTile } from "../templates/stat-tile";

export interface CoeResultsCategory {
  /** e.g. "Cat A" */
  label: string;
  /** Premium, already formatted */
  premium: string;
  /** Change against the previous exercise, in percent */
  delta: number;
}

export interface CoeResultsProps {
  height: number;
  monthLabel: string;
  /** e.g. "Cat A closes at $103,000" */
  headline: string;
  categories: CoeResultsCategory[];
}

/** 02 · COE bidding results: regenerates after each exercise */
export function CoeResults({
  height,
  monthLabel,
  headline,
  categories,
}: CoeResultsProps) {
  return (
    <Frame height={height}>
      <Pill>{`COE bidding results · ${monthLabel}`}</Pill>
      <h2
        style={{
          margin: "22px 0 0 0",
          fontSize: 64,
          lineHeight: 1.04,
          fontWeight: 800,
          letterSpacing: "-0.035em",
          color: OG_COLOURS.ink,
        }}
      >
        {headline}
      </h2>
      <div style={{ flex: 1, minHeight: 36 }} />
      <div style={{ display: "flex", gap: 14 }}>
        {categories.map((category) => (
          <StatTile
            key={category.label}
            label={category.label}
            value={category.premium}
            valueSize={36}
            labelFirst
          >
            <DeltaChip delta={category.delta} />
          </StatTile>
        ))}
      </div>
    </Frame>
  );
}
