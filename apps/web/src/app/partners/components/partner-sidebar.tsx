import { Divider } from "@heroui/divider";
import { Link } from "@heroui/link";
import { cn } from "@heroui/theme";
import { auth } from "@web/app/admin/lib/auth";
import {
  CreditCard,
  LayoutDashboard,
  Megaphone,
  Settings,
} from "lucide-react";
import { headers } from "next/headers";
import { SignOutButton } from "./sign-out-button";

const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Campaigns",
    href: "/campaigns",
    icon: Megaphone,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface PartnerSidebarProps {
  pathname: string;
}

export async function PartnerSidebar({ pathname }: PartnerSidebarProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-divider bg-content1">
      <div className="flex items-center gap-3 px-6 py-4">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
          <Megaphone className="size-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">Partner Dashboard</span>
          <span className="text-default-500 text-xs">
            {session?.user?.email || "SG Cars Trends"}
          </span>
        </div>
      </div>

      <Divider />

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-default-600 hover:bg-default-100",
              )}
            >
              <item.icon className="size-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <Divider />

      <div className="px-3 py-4">
        <SignOutButton />
      </div>
    </aside>
  );
}
