import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { VisitorTrendsChart } from "@web/components/visitor-trends-chart";
import type { AnalyticsData } from "@web/types/analytics";

interface VisitorsAnalyticsProps {
  data: AnalyticsData;
}

export const VisitorsAnalytics = ({ data }: VisitorsAnalyticsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <VisitorTrendsChart data={data.dailyViews} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 border-b pb-2 font-medium text-muted-foreground text-sm">
                <span>Referrer</span>
                <span className="text-right">Views</span>
                <span className="text-right">%</span>
              </div>
              {data.topReferrers.length === 0 ? (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <span>Direct / None</span>
                  <span className="text-right font-medium">
                    {data.totalViews}
                  </span>
                  <span className="text-right text-muted-foreground">100</span>
                </div>
              ) : (
                <>
                  {data.totalViews -
                    data.topReferrers.reduce((sum, r) => sum + r.count, 0) >
                    0 && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <span>Direct / None</span>
                      <span className="text-right font-medium">
                        {data.totalViews -
                          data.topReferrers.reduce(
                            (sum, r) => sum + r.count,
                            0,
                          )}
                      </span>
                      <span className="text-right text-muted-foreground">
                        {Math.round(
                          ((data.totalViews -
                            data.topReferrers.reduce(
                              (sum, r) => sum + r.count,
                              0,
                            )) /
                            data.totalViews) *
                            100,
                        )}
                      </span>
                    </div>
                  )}
                  {data.topReferrers.map((referrer) => (
                    <div
                      key={referrer.referrer}
                      className="grid grid-cols-3 gap-4 text-sm"
                    >
                      <span className="truncate">{referrer.referrer}</span>
                      <span className="text-right font-medium">
                        {referrer.count}
                      </span>
                      <span className="text-right text-muted-foreground">
                        {Math.round((referrer.count / data.totalViews) * 100)}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 border-b pb-2 font-medium text-muted-foreground text-sm">
                <span>Page</span>
                <span className="text-right">Views</span>
                <span className="text-right">%</span>
              </div>
              {data.topPages.map((page) => (
                <div
                  key={page.pathname}
                  className="grid grid-cols-3 gap-4 text-sm"
                >
                  <span className="truncate">{page.pathname}</span>
                  <span className="text-right font-medium">{page.count}</span>
                  <span className="text-right text-muted-foreground">
                    {Math.round((page.count / data.totalViews) * 100)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 border-b pb-2 font-medium text-muted-foreground text-sm">
                <span>Country</span>
                <span className="text-right">Views</span>
                <span className="text-right">%</span>
              </div>
              {data.topCountries.map((country) => (
                <div
                  key={country.country}
                  className="grid grid-cols-3 gap-4 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.country}</span>
                  </div>
                  <span className="text-right font-medium">
                    {country.count}
                  </span>
                  <span className="text-right text-muted-foreground">
                    {Math.round((country.count / data.totalViews) * 100)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 border-b pb-2 font-medium text-muted-foreground text-sm">
                <span>City</span>
                <span className="text-right">Views</span>
                <span className="text-right">%</span>
              </div>
              {data.topCities.map((city) => (
                <div
                  key={`${city.city}-${city.country}`}
                  className="grid grid-cols-3 gap-4 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span>{city.flag}</span>
                    <span>
                      {city.city}, {city.country}
                    </span>
                  </div>
                  <span className="text-right font-medium">{city.count}</span>
                  <span className="text-right text-muted-foreground">
                    {Math.round((city.count / data.totalViews) * 100)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
