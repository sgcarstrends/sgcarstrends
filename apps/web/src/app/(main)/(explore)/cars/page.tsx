import { Card, CardBody, CardHeader } from "@heroui/card";
import Typography from "@web/components/typography";
import { navLinks } from "@web/config/navigation";
import { createPageMetadata } from "@web/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = createPageMetadata({
  title: "Cars",
  description:
    "Explore Singapore vehicle data including new registrations, deregistrations, makes, fuel types, vehicle types, and PARF calculator.",
  canonical: "/cars",
});

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Typography.H1>Cars</Typography.H1>
        <Typography.TextLg>
          Explore Singapore vehicle data across registrations, deregistrations,
          and more.
        </Typography.TextLg>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {navLinks.cars.map(({ title, url, icon: Icon, description }) => (
          <Link key={url} href={url}>
            <Card
              isPressable
              className="h-full bg-content1 p-3 transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center gap-3">
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
    </div>
  );
}
