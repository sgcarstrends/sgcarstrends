"use client";

import { Tab, Tabs } from "@heroui/tabs";
import { navigationSections } from "@web/config/navigation";
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
      {/* Section tabs */}
      <Tabs
        disableAnimation
        color="primary"
        radius="full"
        selectedKey={sectionKey}
        size="lg"
        variant="underlined"
      >
        {navigationSections.map(({ name, href, icon: Icon }) => (
          <Tab
            key={href}
            href={href}
            title={
              <div className="flex items-center gap-2">
                <Icon className="size-5" />
                <span>{name}</span>
              </div>
            }
          />
        ))}
      </Tabs>

      {/* Sub-navigation tabs */}
      {activeSection && activeSection.children.length > 0 && (
        <Tabs
          disableAnimation
          color="primary"
          radius="full"
          selectedKey={subTabKey}
        >
          {activeSection.children.map(({ title, url, icon: Icon }) => (
            <Tab
              key={url}
              href={url}
              title={
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="size-4" />}
                  <span>{title}</span>
                </div>
              }
            />
          ))}
        </Tabs>
      )}
    </div>
  );
};
