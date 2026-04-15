import { PartnerSidebar } from "@web/app/(partners)/components/partner-sidebar";
import { headers } from "next/headers";
import type { ReactNode } from "react";

interface PartnersLayoutProps {
  children: ReactNode;
}

export default async function PartnersLayout({
  children,
}: PartnersLayoutProps) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  return (
    <div className="flex min-h-screen">
      <PartnerSidebar pathname={pathname} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
