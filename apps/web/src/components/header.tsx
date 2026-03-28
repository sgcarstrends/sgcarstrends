"use client";

import { cn } from "@sgcarstrends/ui/lib/utils";
import { BrandLogo } from "@web/components/brand-logo";
import { NAV_ITEMS, type NavItem } from "@web/config/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: NavItem["href"]) => {
    if (path === "/") {
      // Dashboard active for home, cars, coe routes (all dashboard content)
      return (
        !pathname.startsWith("/blog") &&
        !pathname.startsWith("/resources") &&
        !pathname.startsWith("/about")
      );
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-default-200/50 border-b bg-background/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3">
        {/* Brand and Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="rounded-full p-2 text-foreground/70 transition-colors hover:bg-default-100 hover:text-foreground md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <title>Close menu</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <title>Open menu</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
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
            );
          })}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="border-default-200/50 border-t bg-background/95 px-4 pt-2 pb-4 backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col">
            {NAV_ITEMS.map(({ href, label }) => {
              const active = isActive(href);

              return (
                <li key={href}>
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
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
