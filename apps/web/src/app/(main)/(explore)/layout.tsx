import { DashboardNav } from "@web/app/(main)/(explore)/components/dashboard-nav";
import type { ReactNode } from "react";

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex min-h-screen flex-col gap-8">
      <DashboardNav />
      {children}
    </div>
  );
};

export default DashboardLayout;
