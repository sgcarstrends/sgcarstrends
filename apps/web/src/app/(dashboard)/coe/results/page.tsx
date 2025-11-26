import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@sgcarstrends/ui/components/card";
import { COECategories } from "@web/app/(dashboard)/coe/_components/coe-categories";
import { COEPremiumChart } from "@web/app/(dashboard)/coe/_components/premium-chart";
import {
  loadSearchParams,
  type Period,
} from "@web/app/(dashboard)/coe/search-params";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import { TrendTable } from "@web/components/tables/coe-results-table";
import { fetchCOEPageData } from "@web/lib/coe/page-data";
import { createPageMetadata } from "@web/lib/metadata";
import { createWebPageStructuredData } from "@web/lib/metadata/structured-data";
import { getLatestCoeResults } from "@web/queries/coe";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

const title = "COE Historical Results";
const description =
  "Explore historical Certificate of Entitlement (COE) price trends and bidding results for car registrations in Singapore.";

export const generateMetadata = async (): Promise<Metadata> => {
  const results = await getLatestCoeResults();
  const categories = results.reduce<Record<string, number>>(
    (category, current) => {
      category[current.vehicleClass] = current.premium;
      return category;
    },
    {},
  );

  const images = `/api/og/coe?title=COE Results&subtitle=Historical Data&biddingNo=2&categoryA=${categories["Category A"]}&categoryB=${categories["Category B"]}&categoryC=${categories["Category C"]}&categoryD=${categories["Category D"]}&categoryE=${categories["Category E"]}`;

  return createPageMetadata({
    title,
    description,
    canonical: "/coe/results",
    images,
  });
};

const Page = async ({ searchParams }: Props) => {
  const { period } = await loadSearchParams(searchParams);

  return <COEResultsPageContent period={period} />;
};

export default Page;

const COEResultsPageContent = async ({ period }: { period: Period }) => {
  const { coeResults, lastUpdated, data } = await fetchCOEPageData(period);

  const structuredData = createWebPageStructuredData(
    title,
    description,
    "/coe/results",
  );

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-4">
        <PageHeader title="Historical Results" lastUpdated={lastUpdated} />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-9">
            <COEPremiumChart data={data} />
          </div>
          <div className="xl:col-span-3">
            <COECategories />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>List of historical COE prices</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendTable coeResults={coeResults} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
