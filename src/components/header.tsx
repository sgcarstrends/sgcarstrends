"use client";

import { useState } from "react";
import Link from "next/link";
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
import { ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { UnreleasedFeature } from "@/components/unreleased-feature";
import { navLinks } from "@/config/navigation";
import type { NavbarProps } from "@heroui/navbar";

export const Header = (props: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      {...props}
      maxWidth="full"
      height="60px"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="container mx-auto"
    >
      <NavbarBrand>
        <Link href="/">
          <BrandLogo />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex" justify="center">
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
            <DropdownItem
              key={navLinks.cars.overview.title}
              href={navLinks.cars.overview.url}
              className="text-foreground hover:text-primary"
              startContent={
                <navLinks.cars.overview.icon className="size-6 text-blue-500" />
              }
              description={navLinks.cars.overview.description}
            >
              {navLinks.cars.overview.title}
            </DropdownItem>
            <DropdownItem
              key={navLinks.cars.makes.title}
              href={navLinks.cars.makes.url}
              className="text-foreground hover:text-primary"
              startContent={
                <navLinks.cars.makes.icon className="size-6 text-pink-500" />
              }
              description={navLinks.cars.makes.description}
            >
              {navLinks.cars.makes.title}
            </DropdownItem>
            <DropdownItem
              key={navLinks.cars.fuelTypes.title}
              href={navLinks.cars.fuelTypes.url}
              className="text-foreground hover:text-primary"
              startContent={
                <navLinks.cars.fuelTypes.icon className="size-6 text-green-500" />
              }
              description={navLinks.cars.fuelTypes.description}
            >
              {navLinks.cars.fuelTypes.title}
            </DropdownItem>
            <DropdownItem
              key={navLinks.cars.vehicleTypes.title}
              href={navLinks.cars.vehicleTypes.url}
              className="text-foreground hover:text-primary"
              startContent={
                <navLinks.cars.vehicleTypes.icon className="size-6 text-purple-500" />
              }
              description={navLinks.cars.vehicleTypes.description}
            >
              {navLinks.cars.vehicleTypes.title}
            </DropdownItem>
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
          <Link href="/faq">FAQ</Link>
        </NavbarItem>
        <UnreleasedFeature>
          <NavbarItem>
            <Link href="/blog">Blog</Link>
          </NavbarItem>
        </UnreleasedFeature>
        <UnreleasedFeature>
          <NavbarItem>
            <Link href="/visitors">Visitors</Link>
          </NavbarItem>
        </UnreleasedFeature>
      </NavbarContent>
      <NavbarContent className="hidden md:flex" justify="end">
        <NavbarItem className="ml-2 !flex gap-2">
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
              className="text-default-500 hover:text-primary transition-colors"
              aria-label={title}
            >
              <Icon className="size-4" />
            </Button>
          ))}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenuToggle
        aria-label="Toggle navigation menu"
        className="sm:hidden"
      />

      <NavbarMenu>
        <NavbarMenuItem>
          <div className="text-default-600 py-2 text-sm font-medium">Cars</div>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href={navLinks.cars.overview.url}
            className="text-default-700 w-full pl-4"
          >
            {navLinks.cars.overview.title}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href={navLinks.cars.fuelTypes.url}
            className="text-default-700 w-full pl-4"
          >
            {navLinks.cars.fuelTypes.title}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href={navLinks.cars.vehicleTypes.url}
            className="text-default-700 w-full pl-4"
          >
            {navLinks.cars.vehicleTypes.title}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <div className="text-default-600 py-2 text-sm font-medium">COE</div>
        </NavbarMenuItem>
        {navLinks.coe.map((item) => (
          <NavbarMenuItem key={item.title}>
            <Link href={item.url} className="text-default-700 w-full pl-4">
              {item.title}
            </Link>
          </NavbarMenuItem>
        ))}

        <NavbarMenuItem>
          <Link href="/faq">FAQ</Link>
        </NavbarMenuItem>
        <UnreleasedFeature>
          <NavbarMenuItem>
            <Link href="/blog">Blog</Link>
          </NavbarMenuItem>
        </UnreleasedFeature>
        <UnreleasedFeature>
          <NavbarMenuItem>
            <Link href="/visitors">Visitors</Link>
          </NavbarMenuItem>
        </UnreleasedFeature>
      </NavbarMenu>
    </Navbar>
  );
};
