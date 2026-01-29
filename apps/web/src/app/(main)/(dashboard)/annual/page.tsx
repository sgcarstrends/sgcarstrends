import { AnnualRegistrationsChart } from "@web/app/(main)/(dashboard)/annual/components/annual-registrations-chart";
import { AnimatedSection } from "@web/app/(main)/(dashboard)/components/animated-section";
import { KeyStatisticsSection } from "@web/app/(main)/(dashboard)/components/key-statistics-section";
import { PageHeader } from "@web/components/page-header";
import { ShareButtons } from "@web/components/share-buttons";
import { StructuredData } from "@web/components/structured-data";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { getAvailableYears, getYearlyRegistrations } from "@web/queries";
import type { Metadata } from "next";
import { createSerializer, type SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";
import { loadSearchParams, searchParams } from "./search-params";

const serialize = createSerializer(searchParams);

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

interface PageProps {
  searchParams: Promise<SearchParams>;
}

const AnnualPage = async ({ searchParams: searchParamsPromise }: PageProps) => {
  const { year: parsedYear } = await loadSearchParams(searchParamsPromise);

  const [yearlyData, availableYearsData] = await Promise.all([
    getYearlyRegistrations(),
    getAvailableYears(),
  ]);

  const years = availableYearsData.map(({ year }) => year);
  const latestYear = years[0];
  const wasAdjusted = parsedYear !== null && !years.includes(parsedYear);
  const year = wasAdjusted ? latestYear : (parsedYear ?? latestYear);

  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-10">
        <AnimatedSection order={0}>
          <PageHeader
            title="Annual Registrations"
            subtitle="Yearly car registration statistics and trends in Singapore."
            years={years}
            latestYear={latestYear}
            wasAdjusted={wasAdjusted}
            showYearSelector={true}
          >
            <ShareButtons
              url={`${SITE_URL}${serialize("/annual", { year })}`}
              title={`Annual Car Registrations - ${SITE_TITLE}`}
            />
          </PageHeader>
        </AnimatedSection>

        <AnimatedSection order={1}>
          <AnnualRegistrationsChart
            data={yearlyData}
            availableYears={availableYearsData}
          />
        </AnimatedSection>

        <AnimatedSection order={2}>
          <KeyStatisticsSection />
        </AnimatedSection>
      </section>
    </>
  );
};

export default AnnualPage;
