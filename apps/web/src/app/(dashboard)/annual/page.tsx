import { AnnualRegistrationsChart } from "@web/app/(dashboard)/annual/_components/annual-registrations-chart";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { getYearlyRegistrations } from "@web/queries";
import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: "Annual Car Registrations | Total New Registrations by Year",
  description:
    "View total new car registrations in Singapore by year. Interactive chart showing annual registration trends with detailed yearly breakdowns.",
  openGraph: {
    title: "Annual Car Registrations in Singapore",
    description:
      "View total new car registrations in Singapore by year with interactive charts and yearly statistics.",
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

const AnnualPage = async () => {
  const yearlyData = await getYearlyRegistrations();

  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Typography.H1>Annual Registrations</Typography.H1>
          <Typography.TextLg className="text-default-500">
            Total new car registrations in Singapore by year
          </Typography.TextLg>
        </div>

        <AnnualRegistrationsChart data={yearlyData} />
      </section>
    </>
  );
};

export default AnnualPage;
