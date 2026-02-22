import { Card, CardBody, CardHeader } from "@heroui/card";
import { DashboardPageHeader } from "@web/components/dashboard-page-header";
import { DashboardPageTitle } from "@web/components/dashboard-page-title";
import Typography from "@web/components/typography";
import { navLinks } from "@web/config/navigation";
import { createPageMetadata } from "@web/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";

const title = "COE";
const description =
  "Certificate of Entitlement (COE) data for Singapore. View premiums, historical results, and PQP rates.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  canonical: "/coe",
});

const COELandingPage = () => {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader
        title={
          <DashboardPageTitle
            title="COE"
            subtitle="Certificate of Entitlement data and analysis for Singapore."
          />
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {navLinks.coe.map((item) => (
          <Link key={item.url} href={item.url}>
            <Card
              isPressable
              className="h-full rounded-2xl bg-content1 p-3 transition-shadow duration-300 hover:shadow-lg"
            >
              <CardHeader className="flex flex-col items-start gap-2">
                {item.icon && (
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="size-5 text-primary" />
                  </div>
                )}
                <Typography.H4>{item.title}</Typography.H4>
              </CardHeader>
              <CardBody className="pt-0">
                <Typography.TextSm>{item.description}</Typography.TextSm>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default COELandingPage;
