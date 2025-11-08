"use client";

import { Tab, Tabs } from "@heroui/tabs";
import type { NavigationSection } from "@web/config/navigation";
import { navigationSections } from "@web/config/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
}

interface SectionsProps {
  sections: NavigationSection[];
}

interface PagesProps {
  items: NavItem[];
}

const Sections = ({ sections }: SectionsProps) => {
  const pathname = usePathname();

  return (
    <nav className="mb-4 flex items-end gap-4 overflow-x-auto lg:gap-8">
      {sections.map(({ name, href }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={name}
            href={href}
            className={
              isActive
                ? "font-semibold text-2xl text-black lg:text-4xl"
                : "text-gray-400 text-lg hover:text-gray-600 lg:text-2xl"
            }
          >
            {name}
          </Link>
        );
      })}
    </nav>
  );
};

const Pages = ({ items }: PagesProps) => {
  const pathname = usePathname();

  return (
    <div className="mb-8 overflow-x-scroll">
      <Tabs
        disableAnimation
        color="primary"
        radius="full"
        size="lg"
        variant="bordered"
        items={items}
        selectedKey={pathname}
      >
        {items.map(({ name, href }) => {
          return <Tab key={href} href={href} title={name} />;
        })}
      </Tabs>
    </div>
  );
};

export const Navigation = () => {
  const pathname = usePathname();

  // Find active section based on pathname
  const activeSection = navigationSections.find((section) =>
    section.href === "/" ? pathname === "/" : pathname.startsWith(section.href),
  );

  // Map children to Pages items format
  const pageItems =
    activeSection?.children.map((item) => ({
      name: item.title,
      href: item.url,
    })) ?? [];

  return (
    <>
      <Sections sections={navigationSections} />
      {pageItems.length > 0 && <Pages items={pageItems} />}
    </>
  );
};
