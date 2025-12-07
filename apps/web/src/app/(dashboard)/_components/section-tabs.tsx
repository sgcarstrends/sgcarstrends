"use client";

import { Tab, Tabs } from "@heroui/tabs";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { key: "/", title: "Dashboard" },
  { key: "/cars", title: "Cars" },
  { key: "/coe", title: "COE" },
];

export const SectionTabs = () => {
  const pathname = usePathname();

  // Determine selected key based on pathname
  const selectedKey = (() => {
    if (pathname.startsWith("/coe")) return "/coe";
    if (pathname.startsWith("/cars")) return "/cars";
    return "/";
  })();

  return (
    <div>
      <Tabs
        color="primary"
        radius="full"
        selectedKey={selectedKey}
        variant="underlined"
      >
        {SECTIONS.map(({ key, title }) => (
          <Tab key={key} href={key} title={title} />
        ))}
      </Tabs>
    </div>
  );
};
