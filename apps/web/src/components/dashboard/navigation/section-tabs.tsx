"use client";

import type { NavigationSection } from "@web/config/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SectionTabsProps {
  sections: NavigationSection[];
}

export const SectionTabs = ({ sections }: SectionTabsProps) => {
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
