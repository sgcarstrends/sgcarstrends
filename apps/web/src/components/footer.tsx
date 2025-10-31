import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { BrandLogo } from "@web/components/brand-logo";
import { BetaChip, NewChip } from "@web/components/shared/chips";
import Typography from "@web/components/typography";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { navLinks } from "@web/config/navigation";
import Link from "next/link";
import { version } from "../../package.json";

export const Footer = async () => {
  "use cache";

  return (
    <footer className="border-divider border-t bg-content1">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="space-y-4">
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

          {/* Cars Section */}
          <div className="space-y-4">
            <Typography.H4>Cars</Typography.H4>
            <div className="space-y-2">
              {navLinks.cars.map((item) => {
                const hasBadge = Boolean(item.badge);
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={`text-default-600 transition-colors hover:text-primary ${
                      hasBadge ? "flex items-center gap-2" : "block"
                    }`}
                  >
                    <Typography.TextSm>{item.title}</Typography.TextSm>
                    {item.badge === "beta" && <BetaChip />}
                    {item.badge === "new" && <NewChip />}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* COE Section */}
          <div className="space-y-4">
            <Typography.H4>COE</Typography.H4>
            <div className="space-y-2">
              {navLinks.coe.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className="block text-default-600 transition-colors hover:text-primary"
                >
                  <Typography.TextSm>{item.title}</Typography.TextSm>
                </Link>
              ))}
            </div>
          </div>

          {/* General Section */}
          <UnreleasedFeature>
            <div className="space-y-4">
              <Typography.H4>General</Typography.H4>
              <div className="space-y-2">
                {navLinks.general.map((item) => {
                  const showNewChip = ["FAQ", "Blog", "Visitors"].includes(
                    item.title,
                  );
                  return (
                    <Link
                      key={item.title}
                      href={item.url}
                      className={`text-default-600 transition-colors hover:text-primary ${
                        showNewChip ? "flex items-center gap-2" : "block"
                      }`}
                    >
                      <Typography.TextSm>{item.title}</Typography.TextSm>
                      {showNewChip && <NewChip />}
                    </Link>
                  );
                })}
              </div>
            </div>
          </UnreleasedFeature>
        </div>

        <Divider className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-center text-default-600 md:text-left">
            <Typography.TextSm>
              © {new Date().getFullYear()} SGCarsTrends. All rights reserved. •
              v{version}
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
