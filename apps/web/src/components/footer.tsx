import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { BrandLogo } from "@web/components/brand-logo";
import Typography from "@web/components/typography";
import { navLinks } from "@web/config/navigation";
import Link from "next/link";
import { version } from "../../package.json";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/blog", label: "Blog" },
  { href: "/visitors", label: "Visitors" },
  { href: "/faq", label: "FAQ" },
];

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="border-divider border-t bg-content1">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <BrandLogo />
            <Typography.TextSm>
              Your go-to source for Singapore car market data and trends. We
              make sense of the numbers so you don&apos;t have to.
            </Typography.TextSm>
            <div className="flex gap-2">
              {navLinks.socialMedia.map(({ title, url, icon: Icon }) => (
                <Button
                  key={title}
                  as="a"
                  href={url}
                  rel="me noreferrer"
                  target="_blank"
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-default-500 transition-colors hover:text-primary"
                  aria-label={title}
                >
                  <Icon className="size-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation Section */}
          <div className="flex flex-col gap-4">
            <Typography.H4>Navigation</Typography.H4>
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-default-600 transition-colors hover:text-primary"
                >
                  <Typography.TextSm>{item.label}</Typography.TextSm>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Divider className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
          <div className="text-center text-default-600 md:text-left">
            <Typography.TextSm>
              © {CURRENT_YEAR} SGCarsTrends. All rights reserved. • v{version}
            </Typography.TextSm>
            <Typography.TextSm>
              Data provided by{" "}
              <Link
                href="https://datamall.lta.gov.sg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LTA DataMall
              </Link>
            </Typography.TextSm>
          </div>

          <div className="flex gap-4">
            <Link
              href="/legal/privacy-policy"
              className="text-default-600 transition-colors hover:text-primary"
            >
              <Typography.TextSm>Privacy Policy</Typography.TextSm>
            </Link>
            <Link
              href="/legal/terms-of-service"
              className="text-default-600 transition-colors hover:text-primary"
            >
              <Typography.TextSm>Terms of Service</Typography.TextSm>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
