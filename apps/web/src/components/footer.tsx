"use client";

import Link from "next/link";
import { Button, Divider } from "@heroui/react";
import { BrandLogo } from "@/components/brand-logo";
import { UnreleasedFeature } from "@/components/unreleased-feature";
import { navLinks } from "@/config/navigation";

export const Footer = () => (
  <footer className="bg-content1 border-divider border-t">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand Section */}
        <div className="space-y-4">
          <BrandLogo />
          <p className="text-default-600 text-sm leading-relaxed">
            Your go-to source for Singapore car market data and trends. We make
            sense of the numbers so you don&apos;t have to.
          </p>
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
                className="text-default-500 hover:text-primary transition-colors"
                aria-label={title}
              >
                <Icon className="size-4" />
              </Button>
            ))}
          </div>
        </div>

        {/* Cars Section */}
        <div className="space-y-4">
          <h3 className="text-default-900 text-lg font-semibold">Cars</h3>
          <div className="space-y-2">
            <Link
              href={navLinks.cars.overview.url}
              className="text-default-600 hover:text-primary block text-sm transition-colors"
            >
              {navLinks.cars.overview.title}
            </Link>
            <Link
              href={navLinks.cars.fuelTypes.url}
              className="text-default-600 hover:text-primary block text-sm transition-colors"
            >
              {navLinks.cars.fuelTypes.title}
            </Link>
            <Link
              href={navLinks.cars.vehicleTypes.url}
              className="text-default-600 hover:text-primary block text-sm transition-colors"
            >
              {navLinks.cars.vehicleTypes.title}
            </Link>
          </div>
        </div>

        {/* COE Section */}
        <div className="space-y-4">
          <h3 className="text-default-900 text-lg font-semibold">COE</h3>
          <div className="space-y-2">
            {navLinks.coe.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="text-default-600 hover:text-primary block text-sm transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* General Section */}
        <UnreleasedFeature>
          <div className="space-y-4">
            <h3 className="text-default-900 text-lg font-semibold">General</h3>
            <div className="space-y-2">
              {navLinks.general.map((item) => (
                <Link
                  key={item.title}
                  href={item.url}
                  className="text-default-600 hover:text-primary block text-sm transition-colors"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </UnreleasedFeature>
      </div>

      <Divider className="my-8" />

      {/* Bottom Section */}
      <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <div className="text-default-600 text-center text-sm md:text-left">
          <p>
            © {new Date().getFullYear()} SGCarsTrends. All rights reserved.
          </p>
          <p className="mt-1">
            Data provided by{" "}
            <Link
              href="https://datamall.lta.gov.sg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              LTA DataMall
            </Link>
          </p>
        </div>

        <div className="flex gap-4 text-sm">
          <Link
            href="/legal/privacy-policy"
            className="text-default-600 hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/legal/terms-of-service"
            className="text-default-600 hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  </footer>
);
