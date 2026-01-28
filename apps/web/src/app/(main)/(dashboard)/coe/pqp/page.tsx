import { redis } from "@sgcarstrends/utils";
import {
  AnimatedSection,
  ComparisonMixedChart,
  ComparisonSummaryCard,
  DataTable,
  RenewalCalculator,
  TrendsChart,
} from "@web/app/(main)/(dashboard)/coe/components/pqp";
import { PageHeader } from "@web/components/page-header";
import { ShareButtons } from "@web/components/share-buttons";
import { StructuredData } from "@web/components/structured-data";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { LAST_UPDATED_COE_KEY, SITE_TITLE, SITE_URL } from "@web/config";
import { createPageMetadata } from "@web/lib/metadata";
import { getPQPOverview } from "@web/queries/coe";
import type { Pqp } from "@web/types/coe";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";

const title = "COE PQP Rates";
const description =
  "Latest Prevailing Quota Premium (PQP) rates for COE renewal in Singapore. These rates show the average COE prices over the last 3 months.";

export const generateMetadata = (): Metadata => {
  return createPageMetadata({
    title,
    description,
    canonical: "/coe/pqp",
    images: `${SITE_URL}/opengraph-image.png`,
  });
};

const PQPRatesPage = async () => {
  const overview = await getPQPOverview();

  const lastUpdated = await redis.get<number>(LAST_UPDATED_COE_KEY);

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
            <ShareButtons
              url={`${SITE_URL}/coe/pqp`}
              title={`COE PQP Rates - ${SITE_TITLE}`}
            />
          </PageHeader>
        </AnimatedSection>

        <AnimatedSection order={1}>
          <ComparisonSummaryCard data={overview.comparison} />
        </AnimatedSection>

        <AnimatedSection order={2}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TrendsChart data={overview.trendData} />
            <ComparisonMixedChart data={overview.comparison} />
          </div>
        </AnimatedSection>

        <AnimatedSection order={3}>
          <DataTable rows={overview.tableRows} columns={columns} />
        </AnimatedSection>

        <AnimatedSection order={4}>
          <UnreleasedFeature>
            <RenewalCalculator data={overview.categorySummaries} />
          </UnreleasedFeature>
        </AnimatedSection>
      </div>
    </>
  );
};

export default PQPRatesPage;
