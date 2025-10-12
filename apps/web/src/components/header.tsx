"use client";

import type { NavbarProps } from "@heroui/navbar";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { BrandLogo } from "@web/components/brand-logo";
import { BetaChip, NewChip } from "@web/components/chips";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { navLinks } from "@web/config/navigation";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CAR_ICON_COLORS = [
  "text-blue-500",
  "text-pink-500",
  "text-green-500",
  "text-purple-500",
];

const getBadgeContent = (badge?: "beta" | "new") => {
  if (badge === "beta") {
    return <BetaChip />;
  }

  if (badge === "new") {
    return <NewChip />;
  }

  return undefined;
};

export const Header = (props: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      {...props}
      maxWidth="2xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <DesktopHeader />
      <MobileHeader setIsMenuOpen={setIsMenuOpen} />
    </Navbar>
  );
};

const DesktopHeader = () => {
  return (
    <>
      <NavbarBrand>
        <Link href="/">
          <BrandLogo />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden lg:flex" justify="center">
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="bg-transparent p-0 data-[hover=true]:bg-transparent"
                endContent={<ChevronDown className="size-4" />}
                radius="sm"
                variant="light"
              >
                Cars
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="Cars"
            itemClasses={{
              base: "gap-4",
            }}
          >
            {navLinks.cars.map((item, index) => {
              const iconColor =
                item.iconColor ??
                CAR_ICON_COLORS[index % CAR_ICON_COLORS.length];
              const badgeContent = getBadgeContent(item.badge);
              return (
                <DropdownItem
                  key={item.title}
                  href={item.url}
                  className="text-foreground hover:text-primary"
                  startContent={<item.icon className={`size-6 ${iconColor}`} />}
                  endContent={badgeContent}
                  description={item.description}
                >
                  {item.title}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="bg-transparent p-0 data-[hover=true]:bg-transparent"
                endContent={<ChevronDown className="size-4" />}
                radius="sm"
                variant="light"
              >
                COE
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="COE"
            itemClasses={{
              base: "gap-4",
            }}
          >
            {navLinks.coe.map((item, index) => {
              const colors = [
                "text-orange-500",
                "text-red-500",
                "text-indigo-500",
                "text-amber-500",
                "text-teal-500",
              ];
              return (
                <DropdownItem
                  key={item.title}
                  href={item.url}
                  className="text-foreground hover:text-primary"
                  startContent={
                    <item.icon
                      className={`size-6 ${colors[index % colors.length]}`}
                    />
                  }
                  description={item.description}
                >
                  {item.title}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
        <NavbarItem>
          <Link href="/faq" className="flex items-center gap-2">
            FAQ
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/blog" className="flex items-center gap-2">
            Blog
            <BetaChip />
          </Link>
        </NavbarItem>
        <UnreleasedFeature>
          <NavbarItem>
            <Link href="/visitors" className="flex items-center gap-2">
              Visitors
              <NewChip />
            </Link>
          </NavbarItem>
        </UnreleasedFeature>
      </NavbarContent>
      <NavbarContent className="hidden lg:flex" justify="end">
        <NavbarItem className="!flex ml-2 gap-2">
          {navLinks.socialMedia.map(({ title, url, icon: Icon }) => (
            <Button
              key={title}
              as="a"
              href={url}
              rel="me noreferrer"
              target="_blank"
              isIconOnly
              variant="light"
              size="sm"
              className="text-default-500 transition-colors hover:text-primary"
              aria-label={title}
            >
              <Icon className="size-4" />
            </Button>
          ))}
        </NavbarItem>
      </NavbarContent>
    </>
  );
};

const MobileHeader = ({
  setIsMenuOpen,
}: {
  setIsMenuOpen: (isOpen: boolean) => void;
}) => {
  return (
    <>
      <NavbarMenuToggle
        aria-label="Toggle navigation menu"
        className="lg:hidden"
      />
      <NavbarMenu>
        <NavbarMenuItem>
          <div className="py-2 font-medium text-default-600 text-sm">Cars</div>
        </NavbarMenuItem>
        {navLinks.cars.map((item) => {
          const hasBadge = Boolean(item.badge);
          return (
            <NavbarMenuItem key={item.title}>
              <Link
                href={item.url}
                className={`w-full pl-4 text-default-700 ${
                  hasBadge ? "flex items-center gap-2" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
                {item.badge === "beta" && <BetaChip />}
                {item.badge === "new" && <NewChip />}
              </Link>
            </NavbarMenuItem>
          );
        })}
        <NavbarMenuItem>
          <div className="py-2 font-medium text-default-600 text-sm">COE</div>
        </NavbarMenuItem>
        {navLinks.coe.map((item) => (
          <NavbarMenuItem key={item.title}>
            <Link
              href={item.url}
              className="w-full pl-4 text-default-700"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.title}
            </Link>
          </NavbarMenuItem>
        ))}
        {navLinks.general.map((item) => {
          const menuItem = (
            <NavbarMenuItem key={item.title}>
              <Link
                href={item.url}
                className="flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
                <NewChip />
              </Link>
            </NavbarMenuItem>
          );

          return !item.show ? (
            <UnreleasedFeature key={item.title}>{menuItem}</UnreleasedFeature>
          ) : (
            <div key={item.title}>{menuItem}</div>
          );
        })}
      </NavbarMenu>
    </>
  );
};
