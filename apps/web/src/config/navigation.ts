import {
  type IconType,
  SiDiscord,
  SiGithub,
  SiInstagram,
  SiLinkedin,
  SiTelegram,
  SiX,
} from "@icons-pack/react-simple-icons";
import { sortByName } from "@web/utils/sorting";
import {
  BarChart3,
  Calculator,
  Car,
  CarFront,
  Clock,
  FilePlus,
  FileText,
  Fuel,
  Gavel,
  HelpCircle,
  type LucideIcon,
  TrendingUp,
} from "lucide-react";

export interface MainSection {
  name: string;
  href: string;
}

export interface NavigationItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  description?: string;
  show?: boolean;
  badge?: "beta" | "new";
  iconColor?: string;
}

export interface NavigationSection {
  name: string;
  href: string;
  children: NavigationItem[];
}

export interface SocialMedia {
  title: string;
  url: string;
  icon: IconType;
}

export interface NavLinks {
  cars: NavigationItem[];
  coe: NavigationItem[];
  general: NavigationItem[];
  socialMedia: SocialMedia[];
}

export const mainSections: MainSection[] = [
  {
    name: "Dashboard",
    href: "/",
  },
  {
    name: "Cars",
    href: "/cars",
  },
  {
    name: "COE",
    href: "/coe",
  },
  // {
  //   name: "Misc",
  //   href: "/misc",
  // },
];

const dashboardItems: NavigationItem[] = [
  {
    title: "Overview",
    url: "/",
  },
];

const socialMedia: SocialMedia[] = [
  {
    title: "Twitter",
    url: "/twitter",
    icon: SiX,
  },
  {
    title: "Instagram",
    url: "/instagram",
    icon: SiInstagram,
  },
  {
    title: "LinkedIn",
    url: "/linkedin",
    icon: SiLinkedin,
  },
  {
    title: "Telegram",
    url: "/telegram",
    icon: SiTelegram,
  },
  {
    title: "GitHub",
    url: "/github",
    icon: SiGithub,
  },
  {
    title: "Discord",
    url: "/discord",
    icon: SiDiscord,
  },
];

export const navLinks: NavLinks = {
  cars: [
    {
      title: "New Registrations",
      url: "/cars",
      icon: FilePlus,
      description: "Monthly car registration statistics and trends",
      iconColor: "text-blue-500",
    },
    {
      title: "Makes",
      url: "/cars/makes",
      icon: CarFront,
      description: "Car makes statistics and market share analysis",
      badge: "beta",
      iconColor: "text-pink-500",
    },
    {
      title: "Fuel Types",
      url: "/cars/fuel-types",
      icon: Fuel,
      description: "Breakdown by petrol, diesel, hybrid and electric",
      iconColor: "text-green-500",
    },
    {
      title: "Vehicle Types",
      url: "/cars/vehicle-types",
      icon: Car,
      description: "Analysis of saloons, hatchbacks, SUVs and more",
      iconColor: "text-purple-500",
    },
  ],
  coe: [
    {
      title: "Overview",
      url: "/coe",
      icon: BarChart3,
      description: "Current COE premiums and market overview",
    },
    {
      title: "Historical Results",
      url: "/coe/results",
      icon: Clock,
      description: "Past bidding rounds and premium history",
    },
    {
      title: "Trends Analysis",
      url: "/coe/trends",
      icon: TrendingUp,
      description: "Market trends and price movement analysis",
    },
    {
      title: "Bidding Results",
      url: "/coe/bidding",
      icon: Gavel,
      description: "Latest bidding exercise outcomes",
    },
    {
      title: "PQP Rates",
      url: "/coe/pqp",
      icon: Calculator,
      description: "Prevailing quota premiums and calculations",
    },
  ],
  general: [
    {
      title: "Blog",
      url: "/blog",
      icon: FileText,
      description: "Insights and analysis on Singapore's car market",
      show: true,
    },
    {
      title: "FAQ",
      url: "/faq",
      icon: HelpCircle,
      description: "Frequently asked questions about COE and car buying",
      show: true,
    },
    {
      title: "Visitors",
      url: "/visitors",
      icon: BarChart3,
      description: "Website traffic and visitor analytics",
    },
  ],
  socialMedia: sortByName(socialMedia, { sortKey: "title" }),
};

export const navigationSections: NavigationSection[] = [
  {
    name: "Dashboard",
    href: "/",
    children: dashboardItems,
  },
  {
    name: "Cars",
    href: "/cars",
    children: navLinks.cars,
  },
  {
    name: "COE",
    href: "/coe",
    children: navLinks.coe,
  },
];
