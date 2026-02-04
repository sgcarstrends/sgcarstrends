import { Announcement } from "@web/components/announcement";
import { Banner } from "@web/components/banner";
import { Footer } from "@web/components/footer";
import { Header } from "@web/components/header";
import { NotificationPrompt } from "@web/components/notification-prompt";
import type { ReactNode } from "react";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <NotificationPrompt />
      <Suspense fallback={null}>
        <Announcement />
      </Suspense>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <Banner />
      <main className="container mx-auto px-6 py-8">{children}</main>
      <Footer />
    </>
  );
}
