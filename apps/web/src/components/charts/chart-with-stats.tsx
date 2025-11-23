import type { ReactNode } from "react";

interface Stat {
  label: string;
  value: string | number;
}

interface ChartWithStatsProps {
  chart: ReactNode;
  stats: Stat[];
  description?: ReactNode;
  className?: string;
}

/**
 * Reusable container component combining a chart visualization with a metrics grid
 *
 * @example
 * ```tsx
 * <ChartWithStats
 *   chart={<ChartContainer>...</ChartContainer>}
 *   stats={[
 *     { label: "Top Make", value: "Toyota" },
 *     { label: "Total Shown", value: "1,234" },
 *     { label: "Makes Displayed", value: 10 }
 *   ]}
 *   description="This chart shows the top 10 car makes..."
 * />
 * ```
 */
export const ChartWithStats = ({
  chart,
  stats,
  description,
  className = "",
}: ChartWithStatsProps) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`.trim()}>
      {chart}
      <div className="flex flex-col gap-4">
        {description && (
          <div className="text-muted-foreground text-sm">{description}</div>
        )}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 gap-3 rounded-lg bg-muted/30 p-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-semibold text-foreground text-lg">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
