"use client";

import { cn } from "@sgcarstrends/ui/lib/utils";
import type { ComponentProps, ReactNode } from "react";
import { useId } from "react";
import { ResponsiveContainer } from "recharts";
import { type ChartConfig, ChartContext } from "./chart-config";
import { ChartStyle } from "./chart-style";

interface ChartContainerProps extends ComponentProps<"div"> {
  config: ChartConfig;
  children: ComponentProps<typeof ResponsiveContainer>["children"];
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: ChartContainerProps) {
  const uniqueId = useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-default-500",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-default-200",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-default-400",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-layer]:outline-none",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-default-200",
          "[&_.recharts-radial-bar-background-sector]:fill-default-100",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-default-100",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-default-200",
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-sector]:outline-none",
          "[&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer initialDimension={{ width: 0, height: 400 }}>
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}
