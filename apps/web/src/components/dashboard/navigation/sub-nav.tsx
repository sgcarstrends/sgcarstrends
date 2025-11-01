"use client";

import { Tab, Tabs } from "@heroui/tabs";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
}

interface DashboardSubMenuProps {
  items: NavItem[];
}

export const SubNav = ({ items }: DashboardSubMenuProps) => {
  const pathname = usePathname();

  return (
    <div className="mb-8 overflow-x-auto">
      <Tabs
        color="primary"
        radius="full"
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
