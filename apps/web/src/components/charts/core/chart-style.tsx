import type { ChartConfig } from "./chart-config";

const THEMES = { light: "", dark: ".dark" } as const;

interface ChartStyleProps {
  id: string;
  config: ChartConfig;
}

/**
 * Injects scoped CSS variables for chart colour theming.
 *
 * Note: dangerouslySetInnerHTML is safe here because the content is
 * constructed entirely from trusted config keys and colour values
 * defined in application code — no user input is interpolated.
 */
export function ChartStyle({ id, config }: ChartStyleProps) {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme || itemConfig.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  );
}
