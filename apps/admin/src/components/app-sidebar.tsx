"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@admin/components/ui/sidebar";
import {
  Activity,
  BarChart3,
  Car,
  Database,
  DollarSign,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const data = {
  navigation: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Data Management",
      icon: Database,
      items: [
        {
          title: "Car Registrations",
          url: "/data/cars",
          icon: Car,
        },
        {
          title: "COE Results",
          url: "/data/coe",
          icon: DollarSign,
        },
      ],
    },
    {
      title: "Workflows",
      url: "/workflows",
      icon: Workflow,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
    {
      title: "System Health",
      url: "/health",
      icon: Activity,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
    {
      title: "Logs",
      url: "/logs",
      icon: FileText,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">SG Cars Admin</span>
            <span className="truncate text-muted-foreground text-xs">
              Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navigation.map((item) => {
                if (item.items) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      <SidebarMenu className="ml-6">
                        {item.items.map((subItem) => {
                          const isActive = pathname === subItem.url;
                          return (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton asChild isActive={isActive}>
                                <Link href={subItem.url}>
                                  <subItem.icon />
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarMenuItem>
                  );
                }

                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
