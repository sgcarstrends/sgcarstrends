"use client";

import { cn } from "@heroui/theme";
import { getPayloadConfigFromPayload, useChartConfig } from "./chart-config";

type LegendPayloadItem = {
  value?: string;
  dataKey?: string;
  type?: string;
  color?: string;
};

interface ChartLegendContentProps {
  payload?: LegendPayloadItem[];
  verticalAlign?: "top" | "bottom" | "middle";
  hideIcon?: boolean;
  nameKey?: string;
  className?: string;
}

export function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: ChartLegendContentProps) {
  const { config } = useChartConfig();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {payload
        .filter((item: LegendPayloadItem) => item.type !== "none")
        .map((item: LegendPayloadItem) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={item.value}
              className="flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:text-default-400"
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className="text-default-600 text-xs">
                {itemConfig?.label ?? item.value}
              </span>
            </div>
          );
        })}
    </div>
  );
}
