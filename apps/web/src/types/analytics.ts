export interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  topCountries: Array<{
    country: string;
    flag: string;
    count: number;
  }>;
  topCities: Array<{
    city: string;
    country: string;
    flag: string;
    count: number;
  }>;
  topPages: Array<{
    pathname: string;
    count: number;
  }>;
  topReferrers: Array<{
    referrer: string;
    count: number;
  }>;
  dailyViews: Array<{
    date: string;
    count: number;
  }>;
}