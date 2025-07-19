import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { RegistrationStat } from "@/types/cars";

interface Props {
  data: RegistrationStat[];
}

export const BarChartByType = ({ data }: Props) => {
  const chartData = data.map(({ name, count }) => ({
    label: name,
    count,
    fill: "var(--primary)",
  }));
  const totalRegistrations = chartData.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  const topType = chartData[0];

  const chartConfig = {
    count: { label: "Count" },
    label: { color: "var(--background)" },
  } satisfies ChartConfig;

  return (
    <>
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          aria-label={`Vehicle registrations by type, showing ${chartData[0]?.label || "top category"} with ${chartData[0]?.count || 0} registrations`}
        >
          <XAxis type="number" dataKey="count" hide />
          <YAxis
            dataKey="label"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            hide
          />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Bar dataKey="count" radius={4}>
            <LabelList
              dataKey="label"
              position="insideLeft"
              offset={8}
              className="fill-(--color-label)"
              fontSize={12}
            />
            <LabelList
              dataKey="count"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
      <div className="mt-4 space-y-3">
        <div className="text-muted-foreground text-sm">
          <h4 className="text-foreground mb-2 font-semibold">
            Vehicle Type Distribution
          </h4>
          <p>
            This chart displays vehicle registrations categorised by type.
            {topType &&
              `${topType.label} vehicles account for ${topType.count.toLocaleString()} registrations`}
            , showing consumer preferences across different vehicle categories
            in Singapore.
          </p>
        </div>
        <div className="bg-muted/30 grid grid-cols-1 gap-3 rounded-lg p-3 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-foreground text-lg font-semibold">
              {topType?.label || "N/A"}
            </div>
            <div className="text-muted-foreground text-xs">Most Popular</div>
          </div>
          <div className="text-center">
            <div className="text-foreground text-lg font-semibold">
              {totalRegistrations.toLocaleString()}
            </div>
            <div className="text-muted-foreground text-xs">
              Total Registrations
            </div>
          </div>
          <div className="text-center">
            <div className="text-foreground text-lg font-semibold">
              {chartData.length}
            </div>
            <div className="text-muted-foreground text-xs">Vehicle Types</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BarChartByType;
