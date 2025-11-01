import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@web/components/ui/chart";
import type { RegistrationStat } from "@web/types/cars";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

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
    <div className="flex flex-col gap-4">
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
      <div className="flex flex-col gap-4">
        <div className="text-muted-foreground text-sm">
          <h4 className="mb-2 font-semibold text-foreground">
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
        <div className="grid grid-cols-1 gap-3 rounded-lg bg-muted/30 p-3 sm:grid-cols-3">
          <div className="text-center">
            <div className="font-semibold text-foreground text-lg">
              {topType?.label || "N/A"}
            </div>
            <div className="text-muted-foreground text-xs">Most Popular</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground text-lg">
              {totalRegistrations.toLocaleString()}
            </div>
            <div className="text-muted-foreground text-xs">
              Total Registrations
            </div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground text-lg">
              {chartData.length}
            </div>
            <div className="text-muted-foreground text-xs">Vehicle Types</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChartByType;
