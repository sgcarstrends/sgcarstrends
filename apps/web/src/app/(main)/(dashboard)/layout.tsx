import { DashboardNav } from "@web/app/(main)/(dashboard)/_components/dashboard-nav";
import { type ReactNode, Suspense } from "react";

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex min-h-screen flex-col gap-8">
      <Suspense fallback={null}>
        <DashboardNav />
      </Suspense>
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  );
};

export default DashboardLayout;
