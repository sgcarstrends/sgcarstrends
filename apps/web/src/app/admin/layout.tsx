import { Toaster } from "@sgcarstrends/ui/components/sonner";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin Dashboard - SG Cars Trends",
  description: "Admin dashboard for SG Cars Trends",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
