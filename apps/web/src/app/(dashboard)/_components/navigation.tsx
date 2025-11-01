"use client";

import { SectionTabs } from "@web/components/dashboard/navigation/section-tabs";
import { SubNav } from "@web/components/dashboard/navigation/sub-nav";
import { navigationSections } from "@web/config/navigation";
import { usePathname } from "next/navigation";

export const Navigation = () => {
  const pathname = usePathname();

  // Find active section based on pathname
  const activeSection = navigationSections.find((section) =>
    section.href === "/" ? pathname === "/" : pathname.startsWith(section.href),
  );

  // Map children to SubNav items format
  const subNavItems =
    activeSection?.children.map((item) => ({
      name: item.title,
      href: item.url,
    })) ?? [];

  return (
    <>
      <SectionTabs sections={navigationSections} />
      {subNavItems.length > 0 && <SubNav items={subNavItems} />}
    </>
  );
};
