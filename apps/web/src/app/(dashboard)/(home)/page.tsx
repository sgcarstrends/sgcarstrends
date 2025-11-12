import { KeyStatistics } from "@web/app/(dashboard)/(home)/_components/key-statistics";
import { RecentPosts } from "@web/app/(dashboard)/(home)/_components/recent-posts";
import { LatestCOE } from "@web/components/coe/latest-coe";
import { StructuredData } from "@web/components/structured-data";
import { TopMakesByYear } from "@web/components/top-makes-by-year";
import { TotalNewCarRegistrationsByYear } from "@web/components/total-new-car-registrations-by-year";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { getAllPosts } from "@web/lib/data/posts";
import { getTopMakesByYear, getYearlyRegistrations } from "@web/queries/cars";
import { getLatestCOEResults } from "@web/queries/coe";
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

const HomePage = async () => {
  const [yearlyData, latestTopMakes, allPosts, latestCOE] = await Promise.all([
    getYearlyRegistrations(),
    getTopMakesByYear(),
    getAllPosts(),
    getLatestCOEResults(),
  ]);
  const latestYear = yearlyData.at(-1)?.year;
  const structuredData: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_TITLE,
    url: SITE_URL,
    description:
      "Analysis of new car registration trends in Singapore. Insights on popular makes, fuel and vehicle types",
  };
  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-8">
        <LatestCOE results={latestCOE} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <main className="flex flex-col gap-8 lg:col-span-3">
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <TotalNewCarRegistrationsByYear data={yearlyData} />
              {latestYear && (
                <TopMakesByYear topMakes={latestTopMakes} year={latestYear} />
              )}
            </section>
            <section>
              <KeyStatistics data={yearlyData} />
            </section>
          </main>
          <aside className="flex flex-col gap-4">
            <RecentPosts posts={allPosts.slice(0, 3)} />
          </aside>
        </div>
      </section>
    </>
  );
};

export default HomePage;
