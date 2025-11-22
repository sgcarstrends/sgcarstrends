import {
  analyticsTable,
  db,
  type InsertAnalytics,
} from "@sgcarstrends/database";
import { geolocation } from "@web/functions/geolocation";
import {
  and,
  count,
  desc,
  gte,
  isNotNull,
  lte,
  ne,
  type SQL,
  sql,
} from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

interface RequestData {
  pathname: string;
  referrer: string;
}

export const POST = async (request: NextRequest) => {
  const { pathname, referrer }: RequestData = await request.json();
  const { country, flag, city, latitude, longitude } = geolocation(request);

  if (!(country && flag && city && latitude && longitude)) {
    return NextResponse.json({ message: "Missing data is required" });
  }

  const dataToInsert: InsertAnalytics = {
    pathname,
    referrer,
    country,
    city,
    flag,
    latitude,
    longitude,
  };

  await db.insert(analyticsTable).values(dataToInsert);

  return NextResponse.json({ message: dataToInsert });
};

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    // Build date filter condition
    let dateFilter: SQL | undefined;
    if (start && end) {
      dateFilter = and(
        gte(analyticsTable.date, sql`${start}::date`),
        lte(
          analyticsTable.date,
          sql`${end}::date + INTERVAL '1 day' - INTERVAL '1 second'`,
        ),
      );
    } else if (start) {
      dateFilter = gte(analyticsTable.date, sql`${start}::date`);
    } else if (end) {
      dateFilter = lte(
        analyticsTable.date,
        sql`${end}::date + INTERVAL '1 day' - INTERVAL '1 second'`,
      );
    } else {
      // No date filter - return all data for "All Time"
      dateFilter = sql`1=1`;
    }

    const [
      totalViews,
      topCountries,
      topCities,
      topPages,
      topReferrers,
      dailyViews,
    ] = await db.batch([
      db.select({ count: count() }).from(analyticsTable).where(dateFilter),
      db
        .select({
          country: analyticsTable.country,
          flag: analyticsTable.flag,
          count: count(),
        })
        .from(analyticsTable)
        .where(dateFilter)
        .groupBy(analyticsTable.country, analyticsTable.flag)
        .having(isNotNull(analyticsTable.country))
        .orderBy(desc(count()))
        .limit(10),
      db
        .select({
          city: analyticsTable.city,
          country: analyticsTable.country,
          flag: analyticsTable.flag,
          count: count(),
        })
        .from(analyticsTable)
        .where(dateFilter)
        .groupBy(
          analyticsTable.city,
          analyticsTable.country,
          analyticsTable.flag,
        )
        .having(isNotNull(analyticsTable.city))
        .orderBy(desc(count()))
        .limit(10),
      db
        .select({
          pathname: analyticsTable.pathname,
          count: count(),
        })
        .from(analyticsTable)
        .where(dateFilter)
        .groupBy(analyticsTable.pathname)
        .orderBy(desc(count()))
        .limit(10),
      db
        .select({
          referrer: analyticsTable.referrer,
          count: count(),
        })
        .from(analyticsTable)
        .where(and(ne(analyticsTable.referrer, ""), dateFilter))
        .groupBy(analyticsTable.referrer)
        .having(isNotNull(analyticsTable.referrer))
        .orderBy(desc(count()))
        .limit(10),
      db
        .select({
          date: sql<string>`DATE
            (${analyticsTable.date})`,
          count: count(),
        })
        .from(analyticsTable)
        .where(dateFilter)
        .groupBy(sql`DATE
          (${analyticsTable.date})`)
        .orderBy(sql`DATE
          (${analyticsTable.date})`),
    ]);

    return NextResponse.json({
      totalViews: totalViews[0]?.count || 0,
      topCountries,
      topCities,
      topPages,
      topReferrers,
      dailyViews,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 },
    );
  }
};
