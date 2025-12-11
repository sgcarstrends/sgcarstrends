import { StructuredData } from "@web/components/structured-data";
import { SITE_TITLE, SITE_URL } from "@web/config";
import type { Metadata } from "next";
import type { Organization, Person, WebPage, WithContext } from "schema-dts";
import { CommunitySection } from "./_components/community-section";
import { DataSection } from "./_components/data-section";
import { HeroSection } from "./_components/hero-section";
import { MissionSection } from "./_components/mission-section";
import { StatsSection } from "./_components/stats-section";
import { TimelineSection } from "./_components/timeline-section";

const title = "About";
const description =
  "Learn about SG Cars Trends, a platform for exploring Singapore car registration statistics, COE bidding results, and market data. Built to make car market information easier to find and understand.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} - ${SITE_TITLE}`,
    description,
    url: `${SITE_URL}/about`,
    siteName: SITE_TITLE,
    locale: "en_SG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} - ${SITE_TITLE}`,
    description,
    site: "@sgcarstrends",
    creator: "@sgcarstrends",
  },
  alternates: {
    canonical: "/about",
  },
};

const AboutPage = () => {
  const webPageSchema: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${title} - ${SITE_TITLE}`,
    description,
    url: `${SITE_URL}/about`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  const organizationSchema: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_TITLE,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    description:
      "A platform for exploring Singapore car registration statistics, COE bidding results, and market data.",
    sameAs: [
      "https://twitter.com/sgcarstrends",
      "https://github.com/sgcarstrends",
      "https://linkedin.com/company/sgcarstrends",
      "https://t.me/sgcarstrends",
      "https://discord.gg/sgcarstrends",
    ],
    founder: {
      "@type": "Person",
      name: "Ru Chern",
      url: "https://ruchern.dev",
    },
  };

  const personSchema: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ru Chern",
    url: "https://ruchern.dev",
    sameAs: [
      "https://github.com/ruchernchong",
      "https://linkedin.com/in/ruchernchong",
    ],
    knowsAbout: [
      "Software Development",
      "Data Analytics",
      "Singapore Automotive Market",
      "Web Development",
    ],
    jobTitle: "Software Engineer",
  };

  return (
    <>
      <StructuredData data={webPageSchema} />
      <StructuredData data={organizationSchema} />
      <StructuredData data={personSchema} />

      <div className="flex flex-col">
        <HeroSection />
        <StatsSection />
        <MissionSection />
        <DataSection />
        <TimelineSection />
        <CommunitySection />
      </div>
    </>
  );
};

export default AboutPage;
