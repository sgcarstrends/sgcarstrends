"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { cn } from "@heroui/react";
import { BrandLogo } from "@web/components/brand-logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard" },
  // { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
];

export const Header = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") {
      // Dashboard active for home, cars, coe routes (all dashboard content)
      return (
        !pathname.startsWith("/blog") &&
        !pathname.startsWith("/faq") &&
        !pathname.startsWith("/about")
      );
    }
    return pathname.startsWith(path);
  };

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="2xl"
      isBordered={false}
      position="sticky"
    >
      {/* Brand and Mobile Toggle */}
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation */}
      <NavbarContent className="hidden gap-1 md:flex" justify="center">
        {NAV_ITEMS.map(({ href, label }) => {
          const active = isActive(href);

          return (
            <NavbarItem key={href}>
              <Link
                href={href}
                className={cn(
                  "rounded-full px-4 py-2 font-medium text-sm transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-default-100 text-foreground hover:bg-default-200",
                )}
              >
                {label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-background/95 pt-6 backdrop-blur-xl">
        {NAV_ITEMS.map(({ href, label, comingSoon }) => {
          const active = isActive(href);

          if (comingSoon) {
            return (
              <NavbarMenuItem key={href}>
                <span className="flex w-full cursor-not-allowed items-center justify-between py-3 text-default-400 text-lg">
                  {label}
                  <span className="rounded-full bg-default-100 px-2 py-0.5 text-default-500 text-xs">
                    Coming Soon
                  </span>
                </span>
              </NavbarMenuItem>
            );
          }

          return (
            <NavbarMenuItem key={href}>
              <Link
                href={href}
                className={cn(
                  "block w-full py-3 text-lg transition-colors",
                  active
                    ? "font-semibold text-primary"
                    : "text-foreground/70 hover:text-foreground",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </Navbar>
  );
};
