import { AnimatedSection } from "@web/app/(main)/(dashboard)/components/animated-section";
import { DashboardPageHeader } from "@web/components/dashboard-page-header";
import { DashboardPageTitle } from "@web/components/dashboard-page-title";
import { createPageMetadata } from "@web/lib/metadata";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { MakesContentSection } from "./components/makes-content-section";
import { MakesHeaderMeta } from "./components/makes-header-meta";

const title = "Makes";
const description =
  "Comprehensive overview of car makes in Singapore. Explore popular brands, discover all available manufacturers, and view registration trends and market statistics.";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export const generateMetadata = async (): Promise<Metadata> => {
  return createPageMetadata({
    title,
    description,
    canonical: "/cars/makes",
  });
};

const CarMakesPage = ({ searchParams }: PageProps) => {
  return (
    <div className="flex flex-col gap-4">
      <DashboardPageHeader
        title={
          <DashboardPageTitle
            title="Makes"
            subtitle="List of car makes registered in Singapore."
          />
        }
        meta={<MakesHeaderMeta searchParams={searchParams} />}
      />
      <AnimatedSection order={1}>
        <MakesContentSection />
      </AnimatedSection>
    </div>
  );
};

export default CarMakesPage;
