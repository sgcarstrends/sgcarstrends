import { AppSidebar } from "@admin/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@sgcarstrends/ui/components/sidebar";
import { Toaster } from "@sgcarstrends/ui/components/sonner";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@sgcarstrends/ui/globals.css";
import type { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main>
            <header className="sticky top-0 z-10 border-b bg-background px-6 py-4">
              <SidebarTrigger />
            </header>
            <div className="p-6">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </body>
  </html>
);

export default RootLayout;
