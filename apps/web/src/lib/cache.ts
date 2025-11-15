export const CACHE_LIFE = {
  blogs: "blogs",
  latestData: "latest-data",
  monthlyData: "monthly-data",
  statistics: "statistics",
} as const;

const withScope = (...values: string[]) => values;

export const CACHE_TAG = {
  cars: {
    months: () => withScope("cars", "cars-months"),
    latestMonth: () => withScope("cars", "latest-cars-month"),
    dataset: (month: string) => withScope("cars", `cars-${month}`),
    comparison: (month: string) =>
      withScope("cars", `cars-comparison-${month}`),
    types: (month: string) => withScope("cars", `cars-types-${month}`),
    makes: (month: string) => withScope("cars", `cars-makes-${month}`),
    marketShare: (category: string, month: string) =>
      withScope("cars", `market-share-${category}-${month}`),
    topPerformers: (month: string) =>
      withScope("cars", `top-performers-${month}`),
    statsYearly: () => withScope("cars", "stats-yearly"),
    statsTopMakes: (year: string = "latest") =>
      withScope("cars", `stats-top-makes-${year}`),
    popularMakes: (year: string = "latest") =>
      withScope("cars", `popular-makes-${year}`),
  },
  coe: {
    months: () => withScope("coe", "coe-months"),
    latestMonth: () => withScope("coe", "latest-coe-month"),
    latestResults: () => withScope("coe", "latest-coe"),
    all: () => withScope("coe", "coe-all"),
    entry: (month: string) => withScope("coe", `coe-${month}`),
    range: (start: string, end: string) =>
      withScope("coe", `coe-range-${start}-${end}`),
    pqpAll: () => withScope("coe", "pqp-all"),
  },
  blog: {
    all: () => withScope("blog", "all-blogs"),
    postsByIds: () => withScope("blog", "posts-by-ids"),
    entry: (slug: string) => withScope("blog", `blog-${slug}`),
  },
} as const;
