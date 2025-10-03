import LoadingIndicator from "@web/app/loading-indicator";
import { Providers } from "@web/app/providers";
import { Analytics as InternalAnalytics } from "@web/components/analytics";
import { Announcement } from "@web/components/announcement";
import { SectionTabs } from "@web/components/dashboard/section-tabs";
import { Footer } from "@web/components/footer";
import { Header } from "@web/components/header";
import { NotificationPrompt } from "@web/components/notification-prompt";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { FEATURE_FLAG_UNRELEASED, SITE_TITLE, SITE_URL } from "@web/config";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import "./globals.css";
import { cn } from "@heroui/react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Banner } from "@web/components/banner";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = SITE_TITLE;
const description: string = `Statistics for car trends in Singapore. Data provided by Land Transport Authority (LTA)`;
const url = new URL(SITE_URL);

export const metadata: Metadata = {
  metadataBase: url,
  title: {
    template: `%s - ${title}`,
    default: title,
  },
  description,
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    images: `${SITE_URL}/opengraph-image.png`,
    url,
    siteName: title,
    locale: "en_SG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: `${SITE_URL}/twitter-image.png`,
    site: "@sgcarstrends",
    creator: "@sgcarstrends",
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-neutral-100 antialiased`}
      >
        <Providers>
          <NotificationPrompt />
          <Announcement />
          <NuqsAdapter>
            <LoadingIndicator />
            <Header />
            <Banner />
            {/*TODO: Remove the condition after layout is fully migrated*/}
            <main
              className={cn("px-6 py-8", {
                "container mx-auto": !FEATURE_FLAG_UNRELEASED,
              })}
            >
              <UnreleasedFeature>
                <SectionTabs />
              </UnreleasedFeature>
              {children}
            </main>
            <Footer />
          </NuqsAdapter>
          {process.env.NODE_ENV === "production" && <InternalAnalytics />}
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
      <Script
        defer
        src="https://analytics.sgcarstrends.com/script.js"
        data-website-id="b98dda44-ccc9-4a73-87d4-dcbe561aedb8"
        data-domains="sgcarstrends.com"
      />
    </html>
  );
};

export default RootLayout;
