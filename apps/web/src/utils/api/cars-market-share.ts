import { API_URL } from "@/config";
import { fetchApi } from "@/utils/fetch-api";

export interface MarketShareData {
  name: string;
  count: number;
  percentage: number;
  colour: string;
}

export interface MarketShareResponse {
  month: string;
  total: number;
  category: "fuelType" | "vehicleType";
  data: MarketShareData[];
  dominantType: {
    name: string;
    percentage: number;
  };
}

export const fetchMarketShare = async (
  month: string,
  category: "fuelType" | "vehicleType"
): Promise<MarketShareResponse> => {
  const response = await fetchApi<{
    month: string;
    total: number;
    fuelType: Array<{ name: string; count: number }>;
    vehicleType: Array<{ name: string; count: number }>;
  }>(`${API_URL}/cars?month=${month}`);

  const categoryData = response[category];
  const total = response.total;

  const colours = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#8b5cf6", // violet
    "#f59e0b", // amber
    "#ef4444", // rose
    "#06b6d4", // cyan
    "#6366f1", // indigo
    "#f97316", // orange
    "#14b8a6", // teal
    "#84cc16", // lime
  ];

  const marketShareData = categoryData.map((item, index) => ({
    name: item.name,
    count: item.count,
    percentage: (item.count / total) * 100,
    colour: colours[index % colours.length]
  }));

  const dominantType = marketShareData.reduce((max, current) => 
    current.percentage > max.percentage ? current : max
  );

  return {
    month: response.month,
    total,
    category,
    data: marketShareData,
    dominantType: {
      name: dominantType.name,
      percentage: dominantType.percentage
    }
  };
};

export const calculateMarketShareInsights = (data: MarketShareData[]): {
  diversity: number;
  concentration: number;
  top3Share: number;
  insights: string[];
} => {
  const sortedData = [...data].sort((a, b) => b.percentage - a.percentage);
  
  const diversity = data.length;
  const concentration = sortedData[0]?.percentage || 0;
  const top3Share = sortedData.slice(0, 3).reduce((sum, item) => sum + item.percentage, 0);
  
  const insights: string[] = [];
  
  if (concentration > 50) {
    insights.push(`${sortedData[0].name} dominates with ${concentration.toFixed(1)}% market share`);
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
    insights
  };
};

export const formatMarketShareForChart = (data: MarketShareData[]): Array<{
  name: string;
  value: number;
  colour: string;
}> => {
  return data.map(item => ({
    name: item.name,
    value: item.count,
    colour: item.colour
  }));
};