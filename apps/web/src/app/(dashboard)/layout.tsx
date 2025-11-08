import { Navigation } from "@web/app/(dashboard)/_components/navigation";
import { type ReactNode, Suspense } from "react";

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <>
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>
      {children}
    </>
  );
};

export default DashboardLayout;
