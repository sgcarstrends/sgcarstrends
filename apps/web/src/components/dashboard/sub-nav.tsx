"use client";

import { Tab, Tabs } from "@heroui/tabs";

interface NavItem {
  name: string;
  href: string;
}

interface DashboardSubMenuProps {
  items: NavItem[];
}

export const SubNav = ({ items }: DashboardSubMenuProps) => {
  return (
    <Tabs variant="light" color="primary" radius="full" items={items}>
      {items.map(({ name, href }) => {
        return <Tab key={href} href={href} title={name} />;
      })}
    </Tabs>
  );
};
