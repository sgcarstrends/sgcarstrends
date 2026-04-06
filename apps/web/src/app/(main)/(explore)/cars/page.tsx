import { Card, CardBody, CardHeader } from "@heroui/card";
import { NewChip } from "@web/components/shared/chips";
import { StructuredData } from "@web/components/structured-data";
import Typography from "@web/components/typography";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { navLinks } from "@web/config/navigation";
import { generateDataCatalogSchema } from "@web/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Singapore Car Registration Data";
const description =
  "Explore Singapore vehicle data including new registrations, deregistrations, makes, fuel types, vehicle types, and PARF calculator.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/cars`,
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
    canonical: "/cars",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          ...generateDataCatalogSchema(
            "Singapore Vehicle Data Catalogue",
            "Comprehensive collection of Singapore vehicle registration, deregistration, and population datasets sourced from the Land Transport Authority.",
            "/cars",
            ["registrations", "deregistrations", "annual", "electric-vehicles"],
          ),
        }}
      />
      <div className="flex flex-col gap-2">
        <Typography.H1>Cars</Typography.H1>
        <Typography.TextLg>
          Explore Singapore vehicle data across registrations, deregistrations,
          and more.
        </Typography.TextLg>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {navLinks.cars.map(({ title, url, icon: Icon, description, badge }) => (
          <Link key={url} href={url}>
            <Card
              isPressable
              className="h-full bg-content1 p-4 transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center gap-2">
                {Icon && <Icon className="size-5 text-primary" />}
                <Typography.H4>{title}</Typography.H4>
                {badge && <NewChip />}
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
    </div>
  );
}
