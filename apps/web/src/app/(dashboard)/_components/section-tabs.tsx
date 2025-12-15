"use client";

import { navigationSections } from "@web/config/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SectionTabs = () => {
  const pathname = usePathname();

  // Find active item across all sections
  const findActiveKey = () => {
    for (const section of navigationSections) {
      for (const item of section.children) {
        const matches = item.matchPrefix
          ? pathname.startsWith(item.url)
          : pathname === item.url;
        if (matches) return item.url;
      }
    }
    return pathname;
  };

  const activeKey = findActiveKey();

  return (
    <nav className="flex w-fit items-center gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-sm">
      {navigationSections.map((section, sectionIndex) => (
        <div key={section.name} className="flex items-center">
          {/* Divider between sections */}
          {sectionIndex > 0 && <div className="mx-2 h-6 w-px bg-default-200" />}

          {/* Section items */}
          <div className="flex items-center gap-1">
            {section.children.map(({ title, url, icon: Icon }) => {
              const isActive = activeKey === url;
              return (
                <Link
                  key={url}
                  href={url}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-default-500 hover:bg-default-100"
                  }`}
                >
                  {Icon && <Icon className="size-4" />}
                  <span>{title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
};
