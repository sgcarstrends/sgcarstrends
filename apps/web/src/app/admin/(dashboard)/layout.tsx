import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@sgcarstrends/ui/components/sidebar";
import { AppSidebar } from "@web/app/admin/_components/app-sidebar";
import { type ReactNode, Suspense } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <SidebarProvider>
      <Suspense>
        <AppSidebar />
      </Suspense>
      <Suspense>
        <SidebarInset>
          <header className="sticky top-0 z-10 border-b bg-background px-6 py-4">
            <SidebarTrigger />
          </header>
          <main className="p-6">{children}</main>
        </SidebarInset>
      </Suspense>
    </SidebarProvider>
  );
}
