import { KeyStatisticsSection } from "@web/app/(main)/(dashboard)/_components/key-statistics-section";
import { AnnualRegistrationsChart } from "@web/app/(main)/(dashboard)/annual/_components/annual-registrations-chart";
import { ShareButtons } from "@web/components/share-buttons";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { getAvailableYears, getYearlyRegistrations } from "@web/queries";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Annual Car Registrations & Statistics | Singapore Trends",
  description:
    "Comprehensive annual car registration statistics for Singapore. Interactive charts, year-over-year comparisons, and key insights including highest and lowest registration years.",
  openGraph: {
    title: "Annual Car Registrations & Statistics - Singapore",
    description:
      "Explore annual car registration trends in Singapore with interactive charts, year-over-year comparisons, and key statistics.",
    type: "website",
  },
  alternates: {
    canonical: "/annual",
  },
};

const structuredData: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Annual Car Registrations",
  description:
    "Total new car registrations in Singapore by year with interactive charts",
  url: `${SITE_URL}/annual`,
  publisher: {
    "@type": "Organization",
    name: SITE_TITLE,
    url: SITE_URL,
  },
};

const AnnualPage = async () => {
  const [yearlyData, availableYears] = await Promise.all([
    getYearlyRegistrations(),
    getAvailableYears(),
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Typography.H1>Annual Registrations</Typography.H1>
            <ShareButtons
              url={`${SITE_URL}/annual`}
              title={`Annual Car Registrations - ${SITE_TITLE}`}
            />
          </div>
          <Typography.TextLg className="text-default-500">
            Yearly car registration statistics and trends in Singapore.
          </Typography.TextLg>
        </div>

        <AnnualRegistrationsChart
          data={yearlyData}
          availableYears={availableYears}
        />

        <KeyStatisticsSection />
      </section>
    </>
  );
};

export default AnnualPage;
