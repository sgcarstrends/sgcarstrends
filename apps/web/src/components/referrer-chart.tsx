"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
  data: Array<{
    referrer: string;
    count: number;
  }>;
  totalViews: number;
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  direct: {
    label: "Direct",
    color: "hsl(var(--chart-1))",
  },
  google: {
    label: "Google",
    color: "hsl(var(--chart-2))",
  },
  social: {
    label: "Social",
    color: "hsl(var(--chart-3))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const COLOURS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const ReferrerChart = ({ data, totalViews }: Props) => {
  const referrerTotal = data.reduce((sum, item) => sum + item.count, 0);
  const directViews = totalViews - referrerTotal;

  const formattedData = [
    ...(directViews > 0
      ? [{ name: "Direct", count: directViews, fill: COLOURS[0] }]
      : []),
    ...data.slice(0, 4).map((item, index) => {
      let name = item.referrer;

      // Simplify common referrers
      try {
        const parsedUrl = new URL(name);
        const host = parsedUrl.host;

        if (host === "google.com" || host.endsWith(".google.com"))
          name = "Google";
        else if (host === "facebook.com" || host.endsWith(".facebook.com"))
          name = "Facebook";
        else if (
          host === "twitter.com" ||
          host === "x.com" ||
          host.endsWith(".twitter.com") ||
          host.endsWith(".x.com")
        )
          name = "X (Twitter)";
        else if (host === "linkedin.com" || host.endsWith(".linkedin.com"))
          name = "LinkedIn";
        else if (host === "youtube.com" || host.endsWith(".youtube.com"))
          name = "YouTube";
        else if (name.length > 20) name = `${name.substring(0, 20)}...`;
      } catch {
        // If parsing fails, fall back to the original name
        if (name.length > 20) name = `${name.substring(0, 20)}...`;
      }

      return {
        name,
        count: item.count,
        fill: COLOURS[(directViews > 0 ? 1 : 0) + index] || COLOURS[4],
      };
    }),
  ];

  if (formattedData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Sources</CardTitle>
          <CardDescription>Distribution of referrer sources</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No referrer data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
        <CardDescription>Distribution of referrer sources</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [`${value} visitors`, name]}
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
