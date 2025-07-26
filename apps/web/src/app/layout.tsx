import classNames from "classnames";
import { Inter } from "next/font/google";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import LoadingIndicator from "@web/app/loading-indicator";
import { Providers } from "@web/app/providers";
import { Analytics } from "@web/components/analytics";
import { Announcement } from "@web/components/announcement";
import { Footer } from "@web/components/footer";
import { Header } from "@web/components/header";
import { NotificationPrompt } from "@web/components/notification-prompt";
import { ANNOUNCEMENT, SITE_TITLE, SITE_URL } from "@web/config";
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
  return (
    <html lang="en" className="scroll-smooth">
      <body className={classNames(inter.className, "bg-neutral-100")}>
        <Providers>
          <NotificationPrompt />
          {ANNOUNCEMENT && <Announcement>{ANNOUNCEMENT}</Announcement>}
          <NuqsAdapter>
            <LoadingIndicator />
            <Header />
            <main className="container mx-auto px-6 py-8">{children}</main>
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
    </html>
  );
};

export default RootLayout;
