"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

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
  {
    name: "Misc",
    href: "/misc",
  },
];

export const SectionTabs = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-end gap-8">
      {LINKS.map(({ name, href }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Fragment key={name}>
            <Link
              key={name}
              href={href}
              className={
                isActive
                  ? "font-semibold text-4xl text-black"
                  : "text-2xl text-gray-400 hover:text-gray-600"
              }
            >
              {name}
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
};
