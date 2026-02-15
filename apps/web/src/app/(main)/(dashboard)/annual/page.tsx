import { AnnualRegistrationsChart } from "@web/app/(main)/(dashboard)/annual/components/annual-registrations-chart";
import { AnimatedSection } from "@web/app/(main)/(dashboard)/components/animated-section";
import { KeyStatisticsSection } from "@web/app/(main)/(dashboard)/components/key-statistics-section";
import { DashboardPageHeader } from "@web/components/dashboard-page-header";
import { DashboardPageMeta } from "@web/components/dashboard-page-meta";
import { DashboardPageTitle } from "@web/components/dashboard-page-title";
import { SkeletonCard } from "@web/components/shared/skeleton";
import { YearSelector } from "@web/components/shared/year-selector";
import { StructuredData } from "@web/components/structured-data";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { getAvailableYears, getYearlyRegistrations } from "@web/queries";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import type { WebPage, WithContext } from "schema-dts";
import { loadSearchParams } from "./search-params";

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
  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-10">
        <DashboardPageHeader
          title={
            <DashboardPageTitle
              title="Annual Registrations"
              subtitle="Yearly car registration statistics and trends in Singapore."
            />
          }
          meta={
            <Suspense fallback={<SkeletonCard className="h-10 w-40" />}>
              <AnnualHeaderMeta searchParams={searchParamsPromise} />
            </Suspense>
          }
        />

        <Suspense fallback={<SkeletonCard className="h-[460px] w-full" />}>
          <AnnualContent searchParams={searchParamsPromise} />
        </Suspense>
      </section>
    </>
  );
};

async function AnnualHeaderMeta({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { year: parsedYear } = await loadSearchParams(searchParamsPromise);
  const availableYearsData = await getAvailableYears();

  const years = availableYearsData.map(({ year }) => year);
  const latestYear = years[0];
  const wasAdjusted = parsedYear !== null && !years.includes(parsedYear);

  return (
    <DashboardPageMeta>
      <YearSelector
        years={years}
        latestYear={latestYear}
        wasAdjusted={wasAdjusted}
      />
    </DashboardPageMeta>
  );
}

async function AnnualContent({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await loadSearchParams(searchParamsPromise);

  const [yearlyData, availableYearsData] = await Promise.all([
    getYearlyRegistrations(),
    getAvailableYears(),
  ]);

  return (
    <>
      <AnimatedSection order={1}>
        <AnnualRegistrationsChart
          data={yearlyData}
          availableYears={availableYearsData}
        />
      </AnimatedSection>

      <AnimatedSection order={2}>
        <KeyStatisticsSection />
      </AnimatedSection>
    </>
  );
}

export default AnnualPage;
