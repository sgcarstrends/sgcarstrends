export interface Sparkline {
  /** `M x y L x y …` path for the stroke */
  line: string;
  /** The same path closed to the bottom edge, for the fill */
  area: string;
  /** Last point, for the end marker */
  cx: number;
  cy: number;
}

/**
 * Normalises a series into SVG path strings inside a `width` × `height` box,
 * leaving `pad` pixels above and below so the stroke and end marker stay
 * inside the viewBox. Pass `domain` to plot several series on one scale.
 */
export function sparkline(
  data: number[],
  width: number,
  height: number,
  pad: number,
  domain?: { min: number; max: number },
): Sparkline {
  const min = domain?.min ?? Math.min(...data);
  const max = domain?.max ?? Math.max(...data);
  const span = max - min || 1;
  const count = data.length;

  const points = data.map((value, index) => {
    const x = count === 1 ? width / 2 : (index / (count - 1)) * width;
    const y = height - pad - ((value - min) / span) * (height - pad * 2);

    return [x, y] as const;
  });

  const line = points
    .map(
      ([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`,
    )
    .join(" ");
  const [cx, cy] = points[points.length - 1] ?? [width, height];

  return {
    line,
    area: `${line} L${width} ${height} L0 ${height} Z`,
    cx,
    cy,
  };
}
