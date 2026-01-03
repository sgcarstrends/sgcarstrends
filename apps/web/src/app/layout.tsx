import { cn } from "@heroui/react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "@web/app/providers";
import { Announcement } from "@web/components/announcement";
import { Banner } from "@web/components/banner";
import { Footer } from "@web/components/footer";
import { Header } from "@web/components/header";
import LoadingIndicator from "@web/components/loading-indicator";
import { NotificationPrompt } from "@web/components/notification-prompt";
import { Notifications } from "@web/components/notifications";
import { SITE_TITLE, SITE_URL } from "@web/config";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { type ReactNode, Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
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
  authors: [{ name: "SG Cars Trends", url: SITE_URL }],
  creator: "SG Cars Trends",
  publisher: "SG Cars Trends",
  category: "Automotive Statistics",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title,
    description,
    images: [
      {
        url: `${SITE_URL}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "SG Cars Trends - Singapore Car Registration Statistics",
      },
    ],
    url,
    siteName: title,
    locale: "en_SG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${SITE_URL}/twitter-image.png`],
    site: "@sgcarstrends",
    creator: "@sgcarstrends",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <html
      lang="en"
      className={cn("scroll-smooth antialiased", geistSans.className)}
    >
      <body className="bg-background">
        <Providers>
          <NotificationPrompt />
          <Suspense fallback={null}>
            <Notifications />
          </Suspense>
          <Suspense fallback={null}>
            <Announcement />
          </Suspense>
          <NuqsAdapter>
            <LoadingIndicator />
            <Suspense fallback={null}>
              <Header />
            </Suspense>
            <Banner />
            <main className="container mx-auto px-6 py-8">{children}</main>
            <Footer />
          </NuqsAdapter>
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
