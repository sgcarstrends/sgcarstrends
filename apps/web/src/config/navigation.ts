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

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description: string;
  show?: boolean;
}

export interface SocialMedia {
  title: string;
  url: string;
  icon: IconType;
}

export interface NavLinks {
  cars: {
    overview: NavigationItem;
    makes: NavigationItem;
    fuelTypes: NavigationItem;
    vehicleTypes: NavigationItem;
  };
  coe: NavigationItem[];
  general: NavigationItem[];
  socialMedia: SocialMedia[];
}

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
  cars: {
    overview: {
      title: "New Registrations",
      url: "/cars",
      icon: FilePlus,
      description: "Monthly car registration statistics and trends",
    },
    makes: {
      title: "Makes",
      url: "/cars/makes",
      icon: CarFront,
      description: "Car makes statistics and market share analysis",
    },
    fuelTypes: {
      title: "Fuel Types",
      url: "/cars/fuel-types",
      icon: Fuel,
      description: "Breakdown by petrol, diesel, hybrid and electric",
    },
    vehicleTypes: {
      title: "Vehicle Types",
      url: "/cars/vehicle-types",
      icon: Car,
      description: "Analysis of saloons, hatchbacks, SUVs and more",
    },
  },
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
