import { Suspense } from "react";
import { MaintenanceNotice } from "@web/components/maintenance-notice";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const MaintenancePage = () => {
  return (
    <Suspense fallback={null}>
      <MaintenanceNotice />
    </Suspense>
  );
};

export default MaintenancePage;
