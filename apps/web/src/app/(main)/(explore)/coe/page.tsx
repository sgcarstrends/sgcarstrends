import { Card, CardBody, CardHeader } from "@heroui/card";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { navLinks } from "@web/config/navigation";
import { generateDataCatalogSchema } from "@web/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";

const title = "COE Bidding Results Singapore";
const description =
  "Certificate of Entitlement (COE) data for Singapore. View premiums, historical results, and PQP rates.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/coe`,
    siteName: SITE_TITLE,
    locale: "en_SG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    site: "@sgcarstrends",
    creator: "@sgcarstrends",
  },
  alternates: {
    canonical: "/coe",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          ...generateDataCatalogSchema(
            "Singapore COE Data Catalogue",
            "Certificate of Entitlement bidding results, premium trends, and PQP rates for Singapore's vehicle quota system.",
            "/coe",
            ["coe-results", "coe-premiums", "coe-pqp"],
          ),
        }}
      />
      <div className="flex flex-col gap-2">
        <Typography.H1>COE</Typography.H1>
        <Typography.TextLg>
          Certificate of Entitlement data and analysis for Singapore.
        </Typography.TextLg>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {navLinks.coe.map(({ title, url, icon: Icon, description }) => (
          <Link key={url} href={url}>
            <Card
              isPressable
              className="h-full bg-content1 p-4 transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center gap-2">
                {Icon && <Icon className="size-5 text-primary" />}
                <Typography.H4>{title}</Typography.H4>
              </CardHeader>
              {description && (
                <CardBody>
                  <Typography.TextSm>{description}</Typography.TextSm>
                </CardBody>
              )}
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-2xl bg-default-100 p-6">
        <Typography.H3>Related</Typography.H3>
        <Typography.TextSm>
          Explore{" "}
          <Link href="/cars" className="text-primary hover:underline">
            car registration data
          </Link>{" "}
          to see which makes and fuel types are most popular. Read our{" "}
          <Link href="/blog" className="text-primary hover:underline">
            market insights
          </Link>{" "}
          for expert analysis on COE trends.
        </Typography.TextSm>
      </div>
    </div>
  );
}
