import { AnimatedSection } from "@web/app/(main)/(dashboard)/components/animated-section";
import { DashboardPageHeader } from "@web/components/dashboard-page-header";
import { DashboardPageTitle } from "@web/components/dashboard-page-title";
import { PAGE_CONTEXTS } from "@web/components/shared/page-contexts";
import { StructuredData } from "@web/components/structured-data";
import { SITE_URL } from "@web/config";
import { createPageMetadata } from "@web/lib/metadata";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";
import { AboutParf } from "./components/about-parf";
import { PARFCalculator } from "./components/parf-calculator";
import { PARFComparisonTable } from "./components/parf-comparison-table";

const title = "PARF Calculator";
const description =
  "Compare PARF rebates before and after the Budget 2026 changes. Calculate how much less you would receive under the new rates.";

export const generateMetadata = (): Metadata => {
  return createPageMetadata({
    title,
    description,
    canonical: "/cars/parf",
    images: `${SITE_URL}/opengraph-image.png`,
  });
};

export default function PARFCalculatorPage() {
  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/cars/parf`,
  };

  return (
    <div className="flex flex-col gap-4">
      <StructuredData data={structuredData} />
      <DashboardPageHeader
        title={
          <DashboardPageTitle
            title="PARF Calculator"
            subtitle="Compare PARF rebates before and after the Budget 2026 changes."
          />
        }
      />
      <AnimatedSection order={1}>
        <AboutParf {...PAGE_CONTEXTS.parf} />
      </AnimatedSection>
      <AnimatedSection order={2}>
        <PARFCalculator />
      </AnimatedSection>
      <AnimatedSection order={3}>
        <PARFComparisonTable />
      </AnimatedSection>
      <AnimatedSection order={4}>
        <p className="text-center text-default-600 text-xs">
          Figures are for illustration only. The PARF rebate is subject to the
          vehicle&apos;s actual ARF paid and age at deregistration. New rates
          apply to vehicles registered with COEs obtained from the 2nd bidding
          exercise in February 2026 onwards. Source:{" "}
          <a
            href="https://www.lta.gov.sg/content/ltagov/en/newsroom/2026/2/news-releases/revision-parf-rebate-schedule-cap.html"
            className="text-primary underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            LTA
          </a>
          .
        </p>
      </AnimatedSection>
    </div>
  );
}
