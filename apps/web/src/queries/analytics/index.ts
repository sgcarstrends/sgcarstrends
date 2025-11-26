import { analyticsTable, db } from "@sgcarstrends/database";
import type { AnalyticsData } from "@web/types/analytics";
import { and, count, desc, isNotNull, ne, sql } from "drizzle-orm";

export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  "use cache";

  const [
    totalViews,
    topCountries,
    topCities,
    topPages,
    topReferrers,
    dailyViews,
  ] = await db.batch([
    db.select({ count: count() }).from(analyticsTable),
    db
      .select({
        country: sql<string>`${analyticsTable.country}`,
        flag: sql<string>`${analyticsTable.flag}`,
        count: count(),
      })
      .from(analyticsTable)
      .where(
        and(isNotNull(analyticsTable.country), isNotNull(analyticsTable.flag)),
      )
      .groupBy(analyticsTable.country, analyticsTable.flag)
      .orderBy(desc(count()))
      .limit(10),
    db
      .select({
        city: sql<string>`${analyticsTable.city}`,
        country: sql<string>`${analyticsTable.country}`,
        flag: sql<string>`${analyticsTable.flag}`,
        count: count(),
      })
      .from(analyticsTable)
      .where(
        and(
          isNotNull(analyticsTable.city),
          isNotNull(analyticsTable.country),
          isNotNull(analyticsTable.flag),
        ),
      )
      .groupBy(analyticsTable.city, analyticsTable.country, analyticsTable.flag)
      .orderBy(desc(count()))
      .limit(10),
    db
      .select({
        pathname: analyticsTable.pathname,
        count: count(),
      })
      .from(analyticsTable)
      .groupBy(analyticsTable.pathname)
      .orderBy(desc(count()))
      .limit(10),
    db
      .select({
        referrer: sql<string>`${analyticsTable.referrer}`,
        count: count(),
      })
      .from(analyticsTable)
      .where(
        and(
          isNotNull(analyticsTable.referrer),
          ne(analyticsTable.referrer, ""),
        ),
      )
      .groupBy(analyticsTable.referrer)
      .orderBy(desc(count()))
      .limit(10),
    db
      .select({
        date: sql<string>`DATE(${analyticsTable.date})`,
        count: count(),
      })
      .from(analyticsTable)
      .groupBy(sql`DATE(${analyticsTable.date})`)
      .orderBy(sql`DATE(${analyticsTable.date})`),
  ]);

  return {
    totalViews: totalViews[0]?.count ?? 0,
    uniqueVisitors: 0,
    topCountries,
    topCities,
    topPages,
    topReferrers,
    dailyViews,
  };
};
