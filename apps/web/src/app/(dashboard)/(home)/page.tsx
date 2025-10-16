import {
  getTopMakesByYear,
  getYearlyRegistrations,
} from "@web/actions/cars/statistics";
import { LatestCOE } from "@web/components/coe/latest-coe";
import { KeyStatistics } from "@web/components/home/key-statistics";
import { RecentPosts } from "@web/components/home/recent-posts";
import { StructuredData } from "@web/components/structured-data";
import { TopMakesByYear } from "@web/components/top-makes-by-year";
import { TotalNewCarRegistrationsByYear } from "@web/components/total-new-car-registrations-by-year";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { getQueryClient, trpc } from "@web/trpc/server";
import { getLatestCOEResults } from "@web/utils/cached-api";
import type { WebSite, WithContext } from "schema-dts";

const HomePage = async () => {
  const queryClient = getQueryClient();

  const [yearlyData, latestTopMakes, allPosts, latestCOE] = await Promise.all([
    getYearlyRegistrations(),
    getTopMakesByYear(),
    queryClient.fetchQuery(trpc.blog.getAllPosts.queryOptions()),
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
