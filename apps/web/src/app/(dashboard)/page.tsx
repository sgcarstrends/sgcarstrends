import {
  TopMakesSection,
  YearlyChart,
} from "@web/app/(dashboard)/_components/charts-section";
import { CoeSection } from "@web/app/(dashboard)/_components/coe-section";
import { MarketOverview } from "@web/app/(dashboard)/_components/market-overview";
import { PostsSection } from "@web/app/(dashboard)/_components/posts-section";
import { SummaryCard } from "@web/app/(dashboard)/_components/summary-card";
import { WelcomeSection } from "@web/app/(dashboard)/_components/welcome-section";
import { StructuredData } from "@web/components/structured-data";
import { SITE_TITLE, SITE_URL } from "@web/config";
import type { Metadata } from "next";
import { Suspense } from "react";
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

function SummaryCardSkeleton() {
  return (
    <div className="col-span-12 rounded-3xl border-2 border-primary bg-white p-6 lg:col-span-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-12 w-12 animate-pulse rounded-2xl bg-default-200" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-default-200" />
      </div>
      <div className="h-4 w-32 animate-pulse rounded bg-default-200" />
      <div className="mt-2 h-10 w-28 animate-pulse rounded bg-default-200" />
      <div className="mt-4 h-6 w-40 animate-pulse rounded-full bg-default-200" />
    </div>
  );
}

function MarketOverviewSkeleton() {
  return (
    <div className="col-span-12 rounded-3xl border border-default-200 bg-white p-6 lg:col-span-8">
      <div className="mb-4 h-6 w-36 animate-pulse rounded bg-default-200" />
      <div className="grid grid-cols-3 gap-4">
        {/* biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton list */}
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-default-100 p-4">
            <div className="h-4 w-16 animate-pulse rounded bg-default-200" />
            <div className="mt-2 h-7 w-20 animate-pulse rounded bg-default-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

const HomePage = () => {
  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-8">
        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Row 1: Welcome + Summary Card */}
          <WelcomeSection />
          <Suspense fallback={<SummaryCardSkeleton />}>
            <SummaryCard />
          </Suspense>
          {/* Empty 4 cols reserved for future second card */}

          {/* Row 2: COE Results */}
          <CoeSection />

          {/* Row 3: Top Makes + Posts */}
          <TopMakesSection />
          <PostsSection />

          {/* Row 4: Yearly Chart + Market Overview */}
          <YearlyChart />
          <Suspense fallback={<MarketOverviewSkeleton />}>
            <MarketOverview />
          </Suspense>
        </div>
      </section>
    </>
  );
};

export default HomePage;
