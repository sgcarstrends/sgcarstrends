"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
}

const LINKS: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
  },
  {
    name: "Cars",
    href: "/cars",
  },
  {
    name: "COE",
    href: "/coe",
  },
  // {
  //   name: "Misc",
  //   href: "/misc",
  // },
];

export const SectionTabs = () => {
  const pathname = usePathname();

  return (
    <div className="mb-4 flex items-end gap-4 overflow-x-auto lg:gap-8">
      {LINKS.map(({ name, href }) => {
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
    </div>
  );
};
