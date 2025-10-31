import { AnimatedNumber } from "@web/components/animated-number";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { Card, CardContent } from "@web/components/ui/card";
import { VisitorsAnalytics } from "@web/components/visitors-analytics";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { createPageMetadata } from "@web/lib/metadata";
import type { AnalyticsData } from "@web/types/analytics";
import { Users } from "lucide-react";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";

const title = "Visitor Analytics";
const description = "Website visitor statistics and traffic data.";

export const generateMetadata = (): Metadata => {
  return createPageMetadata({
    title,
    description,
    canonical: "/visitors",
  });
};

const VisitorsPage = async () => {
  "use cache";

  let data: AnalyticsData;

  try {
    const response = await fetch(
      new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/api/analytics`),
    );
    if (!response.ok) {
      throw new Error("Failed to fetch analytics data");
    }

    data = await response.json();
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    // Provide default data structure
    data = {
      totalViews: 0,
      uniqueVisitors: 0,
      topCountries: [],
      topCities: [],
      topPages: [],
      topReferrers: [],
      dailyViews: [],
    };
  }

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/visitors`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Typography.H1>Visitor Analytics</Typography.H1>
          <Typography.Lead>
            Website traffic and visitor statistics
          </Typography.Lead>
        </div>

        <Card>
          <CardContent>
            <div className="flex flex-col items-center justify-center gap-4">
              <Typography.H3>Total Visitors</Typography.H3>
              <div className="flex items-center gap-4">
                <Users className="size-8" />
                <div className="font-semibold text-4xl">
                  <AnimatedNumber value={data.totalViews} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <VisitorsAnalytics data={data} />
      </div>
    </>
  );
};

export default VisitorsPage;
