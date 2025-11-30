import { ChartsSection } from "@web/app/(dashboard)/(home)/_components/charts-section";
import { CoeSection } from "@web/app/(dashboard)/(home)/_components/coe-section";
import { KeyStatisticsSection } from "@web/app/(dashboard)/(home)/_components/key-statistics-section";
import { PostsSection } from "@web/app/(dashboard)/(home)/_components/posts-section";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import type { Metadata } from "next";
import type { WebSite, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Singapore Car Registration & COE Trends | Latest Statistics",
  description:
    "Track Singapore car registration trends, COE bidding results, and automotive market insights. Latest data from Land Transport Authority (LTA) with interactive charts and analysis.",
  openGraph: {
    title: "Singapore Car Registration & COE Trends",
    description:
      "Track Singapore car registration trends and COE bidding results with interactive charts and latest market insights.",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

const structuredData: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_TITLE,
  url: SITE_URL,
  description:
    "Analysis of new car registration trends in Singapore. Insights on popular makes, fuel and vehicle types",
};

const HomePage = () => {
  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-8">
        <Typography.H1>Overview</Typography.H1>
        {/* COE section loads first - most important above-the-fold */}
        <CoeSection />

        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <main className="flex flex-col gap-8 lg:col-span-3">
            {/* Charts section */}
            <ChartsSection />

            {/* Key Statistics */}
            <KeyStatisticsSection />
          </main>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            <PostsSection />
          </aside>
        </div>
      </section>
    </>
  );
};

export default HomePage;
