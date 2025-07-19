import { notFound } from "next/navigation";
import { type SearchParams } from "nuqs/server";
import {
  loadSearchParams,
  getDefaultStartDate,
  getDefaultEndDate,
} from "@/app/coe/search-params";
import { COEPremiumChart } from "@/components/COE-premium-chart";
import { PageHeader } from "@/components/page-header";
import { StructuredData } from "@/components/structured-data";
import Typography from "@/components/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API_URL, LAST_UPDATED_COE_KEY, SITE_TITLE, SITE_URL } from "@/config";
import redis from "@/config/redis";
import {
  type COEBiddingResult,
  type COECategory,
  type COEResult,
  type Month,
  RevalidateTags,
} from "@/types";
import { fetchApi } from "@/utils/fetch-api";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}

const COE_CATEGORIES: Record<string, COECategory> = {
  "category-a": "Category A",
  "category-b": "Category B",
  "category-c": "Category C",
  "category-d": "Category D",
  "category-e": "Category E",
};

const getCategoryFromSlug = (slug: string): COECategory | null => {
  return COE_CATEGORIES[slug] || null;
};

const getSlugFromCategory = (category: COECategory): string => {
  return (
    Object.keys(COE_CATEGORIES).find(
      (key) => COE_CATEGORIES[key] === category,
    ) || ""
  );
};

export const generateStaticParams = async () => {
  return Object.keys(COE_CATEGORIES).map((category) => ({
    category,
  }));
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { category: categorySlug } = await params;
  const category = getCategoryFromSlug(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found",
      description: "The requested COE category was not found.",
    };
  }

  const title = `COE ${category} Analysis`;
  const description = `Detailed analysis of Certificate of Entitlement (COE) prices and trends for ${category} vehicles in Singapore.`;
  const canonical = `/coe/categories/${categorySlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_TITLE,
      locale: "en_SG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@sgcarstrends",
      creator: "@sgcarstrends",
    },
    alternates: {
      canonical,
    },
  };
};

const COECategoryPage = async ({ params, searchParams }: Props) => {
  const { category: categorySlug } = await params;
  const category = getCategoryFromSlug(categorySlug);

  if (!category) {
    notFound();
  }

  const { start, end } = await loadSearchParams(searchParams);
  const defaultStart = await getDefaultStartDate();
  const defaultEnd = await getDefaultEndDate();
  const urlParams = new URLSearchParams({
    start: start || defaultStart,
    end: end || defaultEnd,
  });

  const [coeResults, months]: [COEResult[], Month[]] = await Promise.all([
    fetchApi<COEResult[]>(`${API_URL}/coe?${urlParams.toString()}`, {
      next: { tags: [RevalidateTags.COE] },
    }),
    fetchApi<Month[]>(`${API_URL}/coe/months`),
  ]);

  // Filter data for the specific category
  const categoryResults = coeResults.filter(
    (result) => result.vehicle_class === category,
  );

  const lastUpdated = await redis.get<number>(LAST_UPDATED_COE_KEY);

  const groupedData = categoryResults.reduce<COEBiddingResult[]>(
    (acc: any, item) => {
      const key = `${item.month}-${item.bidding_no}`;

      if (!acc[key]) {
        acc[key] = {
          month: item.month,
          biddingNo: item.bidding_no,
        };
      }
      acc[key][item.vehicle_class] = item.premium;

      return acc;
    },
    [],
  );

  const data: COEBiddingResult[] = Object.values(groupedData);

  const title = `COE ${category} Analysis`;
  const description = `Detailed analysis of Certificate of Entitlement (COE) prices and trends for ${category} vehicles in Singapore.`;

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/coe/categories/${categorySlug}`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-4">
        <PageHeader title={`${category} Analysis`} lastUpdated={lastUpdated} />
        <div className="grid grid-cols-1 gap-4">
          <COEPremiumChart data={data} months={months} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{category} Statistics</CardTitle>
            <CardDescription>
              Detailed statistics for {category} vehicles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="text-center">
                <Typography.H3 className="text-2xl font-bold">
                  {categoryResults.length}
                </Typography.H3>
                <Typography.P className="text-muted-foreground text-sm">
                  Total Bidding Rounds
                </Typography.P>
              </div>
              <div className="text-center">
                <Typography.H3 className="text-2xl font-bold">
                  $
                  {Math.round(
                    categoryResults.reduce(
                      (sum, item) => sum + item.premium,
                      0,
                    ) / categoryResults.length,
                  ).toLocaleString()}
                </Typography.H3>
                <Typography.P className="text-muted-foreground text-sm">
                  Average Premium
                </Typography.P>
              </div>
              <div className="text-center">
                <Typography.H3 className="text-2xl font-bold">
                  $
                  {Math.max(
                    ...categoryResults.map((item) => item.premium),
                  ).toLocaleString()}
                </Typography.H3>
                <Typography.P className="text-muted-foreground text-sm">
                  Highest Premium
                </Typography.P>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default COECategoryPage;
