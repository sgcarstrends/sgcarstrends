import type { CarMarketShareData } from "@web/lib/data/cars";

export const CAR_CHART_COLOURS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#6366f1",
  "#f97316",
  "#14b8a6",
  "#84cc16",
] as const;

export const calculateCarMarketShareInsights = (
  data: CarMarketShareData[],
): {
  diversity: number;
  concentration: number;
  top3Share: number;
  insights: string[];
} => {
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);

  const diversity = data.length;
  const concentration = sortedData[0]?.percentage || 0;
  const top3Share = sortedData
    .slice(0, 3)
    .reduce((sum, item) => sum + item.percentage, 0);

  const insights: string[] = [];

  if (concentration > 50) {
    insights.push(
      `${sortedData[0].name} dominates with ${concentration.toFixed(1)}% market share`,
    );
  }

  if (top3Share > 80) {
    insights.push("Market is highly concentrated amongst top 3 categories");
  } else if (top3Share < 60) {
    insights.push("Market shows good diversity across categories");
  }

  if (diversity > 6) {
    insights.push("High category diversity in registrations");
  }

  return {
    diversity,
    concentration,
    top3Share,
    insights,
  };
};

export const formatCarMarketShareForChart = (
  data: CarMarketShareData[],
): Array<{
  name: string;
  value: number;
  colour: string;
}> => {
  return data.map((item) => ({
    name: item.name,
    value: item.count,
    colour: item.colour,
  }));
};

export const getRankingEmoji = (rank: number): string => {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return `#${rank}`;
  }
};
