import { Card, CardBody, CardHeader } from "@heroui/card";
import { CategoryBreakdown } from "@web/app/(dashboard)/cars/deregistrations/_components/category-breakdown";
import { CategoryCards } from "@web/app/(dashboard)/cars/deregistrations/_components/category-cards";
import { TrendsChart } from "@web/app/(dashboard)/cars/deregistrations/_components/trends-chart";
import { loadSearchParams } from "@web/app/(dashboard)/cars/search-params";
import { AnimatedNumber } from "@web/components/animated-number";
import { PageHeader } from "@web/components/page-header";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import {
  toCategorySparklines,
  toMonthlyTotals,
  toPercentageDistribution,
} from "@web/lib/deregistrations/transforms";
import { createPageMetadata } from "@web/lib/metadata";
import {
  getAllDeregistrations,
  getDeregistrationsByCategory,
} from "@web/queries/deregistrations";
import { formatDateToMonthYear } from "@web/utils/format-date-to-month-year";
import {
  fetchMonthsForDeregistrations,
  getMonthOrLatest,
} from "@web/utils/months";
import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import type { WebPage, WithContext } from "schema-dts";

const title = "Vehicle Deregistrations";
const description =
  "Monthly vehicle deregistration statistics in Singapore under the Vehicle Quota System (VQS). Track deregistration trends by category.";

interface Props {
  searchParams: Promise<SearchParams>;
}

export const generateMetadata = async ({
  searchParams,
}: Props): Promise<Metadata> => {
  let { month } = await loadSearchParams(searchParams);

  try {
    month = await getMonthOrLatest(month, "deregistrations");
    const formattedMonth = formatDateToMonthYear(month);

    return createPageMetadata({
      title: `${formattedMonth} ${title}`,
      description,
      canonical: `/cars/deregistrations?month=${month}`,
      includeAuthors: true,
    });
  } catch {
    return createPageMetadata({
      title,
      description,
      canonical: "/cars/deregistrations",
      includeAuthors: true,
    });
  }
};

const DeregistrationsPage = async ({ searchParams }: Props) => {
  let { month } = await loadSearchParams(searchParams);

  let months: string[] = [];

  try {
    months = await fetchMonthsForDeregistrations();
    month = await getMonthOrLatest(month, "deregistrations");
  } catch {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Vehicle Deregistrations" />
        <Typography.Text>No deregistration data available.</Typography.Text>
      </div>
    );
  }

  const [categories, allDeregistrations] = await Promise.all([
    getDeregistrationsByCategory(month),
    getAllDeregistrations(),
  ]);

  const totalDeregistrations = categories.reduce(
    (sum, item) => sum + item.total,
    0,
  );

  const formattedMonth = formatDateToMonthYear(month);

  const trendsData = toMonthlyTotals(allDeregistrations);
  const categoryCardsData = toCategorySparklines(
    allDeregistrations,
    categories,
  );
  const categoryBreakdownData = toPercentageDistribution(categories);

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/cars/deregistrations`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Vehicle Deregistrations"
          months={months}
          showMonthSelector={true}
        />

        <section>
          <Card>
            <CardHeader className="flex flex-col items-start gap-1">
              <Typography.H4>Total Deregistrations</Typography.H4>
              <Typography.TextSm className="text-default-500">
                {formattedMonth}
              </Typography.TextSm>
            </CardHeader>
            <CardBody>
              <div className="font-bold text-5xl text-primary">
                <AnimatedNumber value={totalDeregistrations} />
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="flex flex-col gap-4">
          <Typography.H2>By Category</Typography.H2>
          <CategoryCards categories={categoryCardsData} />
        </section>

        <section className="flex flex-col gap-4">
          <Typography.H2>Historical Trends</Typography.H2>
          <TrendsChart data={trendsData} />
        </section>

        <section className="flex flex-col gap-4">
          <Typography.H2>Category Breakdown</Typography.H2>
          <CategoryBreakdown
            data={categoryBreakdownData}
            month={formattedMonth}
          />
        </section>
      </div>
    </>
  );
};

export default DeregistrationsPage;
