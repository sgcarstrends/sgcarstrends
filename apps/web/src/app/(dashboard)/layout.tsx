"use client";

import { SectionTabs } from "@web/components/dashboard/navigation/section-tabs";
import { SubNav } from "@web/components/dashboard/navigation/sub-nav";
import { navLinks } from "@web/config/navigation";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const dashboardItems = [
  { name: "Overview", href: "/" },
  // { name: "Annual", href: "/annual" },
  // { name: "Monthly", href: "/monthly" },
];

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const pathname = usePathname();

  // Determine which SubNav items to show based on pathname
  let subNavItems = dashboardItems;

  if (pathname.startsWith("/cars")) {
    subNavItems = navLinks.cars.map((item) => ({
      name: item.title,
      href: item.url,
    }));
  } else if (pathname.startsWith("/coe")) {
    subNavItems = navLinks.coe.map((item) => ({
      name: item.title,
      href: item.url,
    }));
  }

  return (
    <>
      <SectionTabs />
      <SubNav items={subNavItems} />
      {children}
    </>
  );
};

export default DashboardLayout;
