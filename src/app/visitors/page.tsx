import { StructuredData } from "@/components/structured-data";
import Typography from "@/components/typography";
import { VisitorsAnalytics } from "@/components/visitors-analytics";
import { SITE_TITLE, SITE_URL } from "@/config";
import type { AnalyticsData } from "@/types/analytics";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";

export const generateMetadata = (): Metadata => {
  const title = "Visitor Analytics";
  const description = "Website visitor statistics and traffic data.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/visitors",
      siteName: SITE_TITLE,
      locale: "en_SG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@sgcarstrends",
      creator: "@sgcarstrends",
    },
    alternates: {
      canonical: "/visitors",
    },
  };
};

interface VisitorsPageProps {
  searchParams: Promise<{
    start?: string;
    end?: string;
  }>;
}

const VisitorsPage = async ({ searchParams }: VisitorsPageProps) => {
  const params = await searchParams;
  const { start, end } = params;

  let data: AnalyticsData;

  try {
    // Build API URL with search parameters
    const apiUrl = new URL(`${process.env.NEXT_PUBLIC_SITE_URL}/api/analytics`);
    if (start) apiUrl.searchParams.set("start", start);
    if (end) apiUrl.searchParams.set("end", end);

    const response = await fetch(apiUrl.toString());
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

  const title = "Visitor Analytics";
  const description = "Website visitor statistics and traffic data.";

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
          <Typography.P className="text-muted-foreground">
            Website traffic and visitor statistics
          </Typography.P>
        </div>

        <VisitorsAnalytics initialData={data} />
      </div>
    </>
  );
};

export default VisitorsPage;
