"use client";

import { cn } from "@heroui/react";
import { BrandLogo } from "@web/components/brand-logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/blog", label: "Blog" },
  { href: "/visitors", label: "Visitors" },
  { href: "/faq", label: "FAQ" },
];

export const Header = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 px-6 py-4">
      <div className="mx-auto flex max-w-fit items-center gap-6 rounded-full px-8 py-2 shadow-lg backdrop-blur-md">
        <Link href="/" className="flex-shrink-0">
          <BrandLogo />
        </Link>
        <nav className="flex items-center gap-4">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-full px-2 py-1 font-medium text-secondary-foreground text-sm transition-colors hover:bg-primary/75 hover:text-primary-foreground",
                isActive(href) &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
