import { loadSearchParams } from "@web/app/(dashboard)/coe/search-params";
import { COECategories } from "@web/components/coe/coe-categories";
import { COEPremiumChart } from "@web/components/coe/premium-chart";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import { TrendTable } from "@web/components/tables/coe-results-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { fetchCOEPageData } from "@web/lib/coe/page-data";
import { getLatestCOEResults } from "@web/lib/coe/queries";
import { createPageMetadata } from "@web/lib/metadata";
import { createWebPageStructuredData } from "@web/lib/metadata/structured-data";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

interface Props {
  searchParams: Promise<SearchParams>;
}

const title = "COE Historical Results";
const description =
  "Explore historical Certificate of Entitlement (COE) price trends and bidding results for car registrations in Singapore.";

export const generateMetadata = async (): Promise<Metadata> => {
  const results = await getLatestCOEResults();
  const categories = results.reduce<Record<string, number>>(
    (category, current) => {
      category[current.vehicle_class] = current.premium;
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

const COEResultsPage = async ({ searchParams }: Props) => {
  const { start, end } = await loadSearchParams(searchParams);
  const { coeResults, months, lastUpdated, data } = await fetchCOEPageData(
    start,
    end,
  );

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
            <COEPremiumChart data={data} months={months} />
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

export default COEResultsPage;
