import {
  getTopMakesByYear,
  getYearlyRegistrations,
} from "@web/actions/cars/statistics";
import { SectionTabs } from "@web/components/dashboard/section-tabs";
import { SubNav } from "@web/components/dashboard/sub-nav";
import { KeyStatistics } from "@web/components/key-statistics";
import { StructuredData } from "@web/components/structured-data";
import { TopMakesByYear } from "@web/components/top-makes-by-year";
import { TotalNewCarRegistrationsByYear } from "@web/components/total-new-car-registrations-by-year";
import { SITE_TITLE, SITE_URL } from "@web/config";
import type { WebSite, WithContext } from "schema-dts";

const items = [
  { name: "Overview", href: "/" },
  {
    name: "Annual",
    href: "/annual",
  },
  {
    name: "Monthly",
    href: "/monthly",
  },
];

const HomePage = async () => {
  const [yearlyData, latestTopMakes] = await Promise.all([
    getYearlyRegistrations(),
    getTopMakesByYear(),
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
        {/*TODO: The SectionTabs will go into the Layout*/}
        <SectionTabs />
        <SubNav items={items} />
        <div className="flex flex-col gap-8">
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TotalNewCarRegistrationsByYear data={yearlyData} />
            {latestYear && (
              <TopMakesByYear topMakes={latestTopMakes} year={latestYear} />
            )}
          </section>
          <section>
            <KeyStatistics data={yearlyData} />
          </section>
        </div>
      </section>
    </>
  );
};

export default HomePage;
