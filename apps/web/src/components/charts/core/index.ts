// Re-export Recharts primitives (consumers pass our Content components via the `content` prop)
export { Legend as ChartLegend, Tooltip as ChartTooltip } from "recharts";
export { type ChartConfig, useChartConfig } from "./chart-config";
export { ChartContainer } from "./chart-container";
export { ChartLegendContent } from "./chart-legend-content";
export { ChartTooltipContent } from "./chart-tooltip-content";
