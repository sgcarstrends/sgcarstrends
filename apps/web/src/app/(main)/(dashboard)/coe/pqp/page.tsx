import { redis } from "@sgcarstrends/utils";
import {
  ComparisonMixedChart,
  ComparisonSummaryCard,
  DataTable,
  RenewalCalculator,
  TrendsChart,
} from "@web/app/(main)/(dashboard)/coe/components/pqp";
import { AnimatedSection } from "@web/app/(main)/(dashboard)/components/animated-section";
import { PageHeader } from "@web/components/page-header";
import { MonthSelector } from "@web/components/shared/month-selector";
import { PageContext } from "@web/components/shared/page-context";
import { PAGE_CONTEXTS } from "@web/components/shared/page-contexts";
import { StructuredData } from "@web/components/structured-data";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { LAST_UPDATED_COE_KEY, SITE_TITLE, SITE_URL } from "@web/config";
import { createPageMetadata } from "@web/lib/metadata";
import { getPQPOverview } from "@web/queries/coe";
import type { Pqp } from "@web/types/coe";
import { fetchMonthsForCOE, getMonthOrLatest } from "@web/utils/dates/months";
import type { Metadata } from "next";
import { createSerializer, type SearchParams } from "nuqs/server";
import { Suspense } from "react";
import type { WebPage, WithContext } from "schema-dts";
import { loadSearchParams, searchParams } from "./search-params";

const serialize = createSerializer(searchParams);

const title = "COE PQP Rates";
const description =
  "Latest Prevailing Quota Premium (PQP) rates for COE renewal in Singapore. These rates show the average COE prices over the last 3 months.";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export const generateMetadata = (): Metadata => {
  return createPageMetadata({
    title,
    description,
    canonical: "/coe/pqp",
    images: `${SITE_URL}/opengraph-image.png`,
  });
};

const PQPRatesPage = async ({
  searchParams: searchParamsPromise,
}: PageProps) => {
  const { month: parsedMonth } = await loadSearchParams(searchParamsPromise);

  const [overview, lastUpdated, months] = await Promise.all([
    getPQPOverview(),
    redis.get<number>(LAST_UPDATED_COE_KEY),
    fetchMonthsForCOE(),
  ]);

  const { month, wasAdjusted } = await getMonthOrLatest(parsedMonth, "coe");
  const latestMonth = months[0];

  const columns: Pqp.TableColumn[] = [
    { key: "month", label: "Month", sortable: true },
    { key: "Category A", label: "Category A" },
    { key: "Category B", label: "Category B" },
    { key: "Category C", label: "Category C" },
    { key: "Category D", label: "Category D" },
  ];

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/coe/pqp`,
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-4">
        <AnimatedSection order={0}>
          <PageHeader
            title="PQP Rates"
            subtitle="Prevailing Quota Premium rates for COE renewal in Singapore."
            lastUpdated={lastUpdated}
          >
            <Suspense fallback={null}>
              <MonthSelector
                months={months}
                latestMonth={latestMonth}
                wasAdjusted={wasAdjusted}
              />
            </Suspense>
          </PageHeader>
        </AnimatedSection>

        <AnimatedSection order={1}>
          <PageContext {...PAGE_CONTEXTS.pqp} />
        </AnimatedSection>

        <AnimatedSection order={2}>
          <ComparisonSummaryCard data={overview.comparison} />
        </AnimatedSection>

        <AnimatedSection order={3}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TrendsChart data={overview.trendData} />
            <ComparisonMixedChart data={overview.comparison} />
          </div>
        </AnimatedSection>

        <AnimatedSection order={4}>
          <DataTable rows={overview.tableRows} columns={columns} />
        </AnimatedSection>

        <AnimatedSection order={5}>
          <UnreleasedFeature>
            <RenewalCalculator data={overview.categorySummaries} />
          </UnreleasedFeature>
        </AnimatedSection>
      </div>
    </>
  );
};

export default PQPRatesPage;
