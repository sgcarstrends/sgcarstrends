"use client";

import { navigationSections } from "@web/config/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SectionTabs = () => {
  const pathname = usePathname();

  // Determine active section based on pathname
  const activeSection = navigationSections.find((section) =>
    section.href === "/"
      ? pathname === "/" || pathname === "/annual"
      : pathname.startsWith(section.href),
  );

  // Selected key for section tabs
  const sectionKey = activeSection?.href ?? "/";

  // Find selected sub-tab key
  const subTabKey =
    activeSection?.children.reduce(
      (best, item) => {
        const matches = item.matchPrefix
          ? pathname.startsWith(item.url)
          : pathname === item.url;

        if (!matches) return best;
        if (!best || item.url.length > best.length) return item.url;
        return best;
      },
      null as string | null,
    ) ?? pathname;

  return (
    <div className="flex flex-col gap-4">
      {/* Section tabs - Pill style */}
      <nav className="flex w-full max-w-full items-center gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-sm">
        {navigationSections.map(({ name, href, icon: Icon }) => {
          const isActive = sectionKey === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 font-medium text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-default-500 hover:bg-default-100"
              }`}
            >
              <Icon className="size-4" />
              <span>{name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sub-navigation tabs - Pill style */}
      {activeSection && activeSection.children.length > 0 && (
        <nav className="flex w-full max-w-full items-center gap-1 overflow-x-auto rounded-full bg-white/50 p-1">
          {activeSection.children.map(({ title, url, icon: Icon }) => {
            const isActive = subTabKey === url;
            return (
              <Link
                key={url}
                href={url}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-medium text-sm transition-colors ${
                  isActive
                    ? "bg-white text-foreground shadow-sm"
                    : "text-default-500 hover:bg-white/50"
                }`}
              >
                {Icon && <Icon className="size-4" />}
                <span>{title}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
};
