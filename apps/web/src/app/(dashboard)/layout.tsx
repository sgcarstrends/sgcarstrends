import { SectionTabs } from "@web/app/(dashboard)/_components/section-tabs";
import { type ReactNode, Suspense } from "react";

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-8">
          <Suspense fallback={null}>
            <SectionTabs />
          </Suspense>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
