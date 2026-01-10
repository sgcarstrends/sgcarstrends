import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@sgcarstrends/ui/components/sidebar";
import { AppSidebar } from "@web/app/admin/_components/app-sidebar";
import type { ReactNode } from "react";

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 border-b bg-background px-6 py-4">
          <SidebarTrigger />
        </header>
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
