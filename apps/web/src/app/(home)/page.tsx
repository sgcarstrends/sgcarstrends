import {
  getTopMakes,
  getYearlyRegistrations,
} from "@web/actions/cars/statistics";
import { SectionTabs } from "@web/components/dashboard/section-tabs";
import { SubNav } from "@web/components/dashboard/sub-nav";
import { KeyStatistics } from "@web/components/key-statistics";
import { StructuredData } from "@web/components/structured-data";
import { Top5CarMakesByYear } from "@web/components/top-5-car-makes-by-year";
import { TotalNewCarRegistrationsByYear } from "@web/components/total-new-car-registrations-by-year";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
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
  // Fetch data using server actions
  const [yearlyData, topMakes] = await Promise.all([
    getYearlyRegistrations(),
    getTopMakes(5),
  ]);
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
      <section className="flex flex-col gap-y-8">
        {/*TODO: The SectionTabs will go into the Layout*/}
        <SectionTabs />
        <SubNav items={items} />
        <UnreleasedFeature>
          <div className="flex flex-col gap-y-4">
            <TotalNewCarRegistrationsByYear data={yearlyData} />
            <KeyStatistics data={yearlyData} />
            <Top5CarMakesByYear topMakes2023={topMakes} />
          </div>
        </UnreleasedFeature>
      </section>
    </>
  );
};

export default HomePage;
