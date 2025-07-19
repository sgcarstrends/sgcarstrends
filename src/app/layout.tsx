import React, { type ReactNode } from "react";
import { Inter } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import classNames from "classnames";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import LoadingIndicator from "@/app/loading-indicator";
import { Providers } from "@/app/providers";
import { Analytics } from "@/components/analytics";
import { Announcement } from "@/components/announcement";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { NotificationPrompt } from "@/components/notification-prompt";
import { ANNOUNCEMENT, SITE_TITLE, SITE_URL } from "@/config";
import "./globals.css";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

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
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" className="scroll-smooth">
      <body className={classNames(inter.className)}>
        <Providers>
          <NotificationPrompt />
          {ANNOUNCEMENT && <Announcement>{ANNOUNCEMENT}</Announcement>}
          <NuqsAdapter>
            <LoadingIndicator />
            <Header />
            <main className="container mx-auto px-4 py-16">{children}</main>
            <Footer />
          </NuqsAdapter>
          {process.env.NODE_ENV === "production" && <Analytics />}
        </Providers>
      </body>
      <Script
        defer
        src="https://analytics.sgcarstrends.com/script.js"
        data-website-id="b98dda44-ccc9-4a73-87d4-dcbe561aedb8"
        data-domains="sgcarstrends.com"
      />
      <GoogleAnalytics gaId={gaMeasurementId} />
    </html>
  );
};

export default RootLayout;
