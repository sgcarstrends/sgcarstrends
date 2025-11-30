import type { SelectPost } from "@sgcarstrends/database";
import { BlogList } from "@web/app/blog/_components/blog-list";
import { StructuredData } from "@web/components/structured-data";
import { SubscribeForm } from "@web/components/subscribe-form";
import Typography from "@web/components/typography";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { getAllPosts } from "@web/queries/posts";
import type { Metadata } from "next";
import type { Blog, WithContext } from "schema-dts";

const title = "Blog";
const description =
  "Articles from the insights & analysis on Singapore's car and COE trends.";
const url = "/blog";

const structuredData: WithContext<Blog> = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: title,
  url,
  description,
};

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: {
    canonical: url,
  },
};

// ⚠️ TEMPORARY MOCK DATA - DELETE BEFORE COMMIT
const mockPosts: SelectPost[] = [
  {
    id: "mock-1",
    title: "Singapore COE Premiums Show Mixed Trends November 2025",
    slug: "coe-premiums-mixed-trends-november-2025",
    content:
      "November 2025 COE bidding exercises presented a mixed bag of results for prospective car buyers in Singapore.",
    metadata: {
      dataType: "coe",
      excerpt:
        "November 2025 COE bidding exercises presented a mixed bag of results for prospective car buyers in Singapore.",
      readingTime: 5,
    },
    month: "2025-11",
    dataType: "coe",
    createdAt: new Date("2025-11-20"),
    modifiedAt: new Date("2025-11-20"),
    publishedAt: new Date("2025-11-20"),
  },
  {
    id: "mock-2",
    title: "Electric Vehicles Dominate Singapore October 2025",
    slug: "ev-dominate-singapore-october-2025",
    content:
      "Singapore's car market in October 2025 saw a remarkable shift towards electrification.",
    metadata: {
      dataType: "cars",
      excerpt:
        "Singapore's car market in October 2025 saw a remarkable shift towards electrification, with Electric Vehicles (EVs) securing over half of all new registrations.",
      readingTime: 4,
    },
    month: "2025-10",
    dataType: "cars",
    createdAt: new Date("2025-11-12"),
    modifiedAt: new Date("2025-11-12"),
    publishedAt: new Date("2025-11-12"),
  },
  {
    id: "mock-3",
    title: "Singapore Car Market: September 2025 Snapshot",
    slug: "singapore-car-market-september-2025",
    content:
      "September 2025 registration data highlights a strong preference for electrified powertrains.",
    metadata: {
      dataType: "cars",
      excerpt:
        "September 2025 registration data highlights a strong preference for electrified powertrains.",
      readingTime: 6,
    },
    month: "2025-09",
    dataType: "cars",
    createdAt: new Date("2025-10-26"),
    modifiedAt: new Date("2025-10-26"),
    publishedAt: new Date("2025-10-26"),
  },
  {
    id: "mock-4",
    title: "October 2025 COE Bidding: Premiums Ease",
    slug: "october-2025-coe-bidding-premiums-ease",
    content:
      "October 2025 COE bidding exercises presented a mixed but generally softer market.",
    metadata: {
      dataType: "coe",
      excerpt:
        "October 2025 COE bidding exercises presented a mixed but generally softer market, particularly for passenger vehicles.",
      readingTime: 5,
    },
    month: "2025-10",
    dataType: "coe",
    createdAt: new Date("2025-10-26"),
    modifiedAt: new Date("2025-10-26"),
    publishedAt: new Date("2025-10-26"),
  },
  {
    id: "mock-5",
    title: "Electric and Hybrid Vehicles Surge in August 2025",
    slug: "ev-hybrid-surge-august-2025",
    content:
      "August 2025 saw a remarkable shift in Singapore's automotive landscape.",
    metadata: {
      dataType: "cars",
      excerpt:
        "August 2025 saw a remarkable shift in Singapore's automotive landscape, with electric vehicles and hybrid models together capturing over 86% of all new car registrations.",
      readingTime: 7,
    },
    month: "2025-08",
    dataType: "cars",
    createdAt: new Date("2025-09-12"),
    modifiedAt: new Date("2025-09-12"),
    publishedAt: new Date("2025-09-12"),
  },
];

const Page = async () => {
  // ⚠️ TEMPORARY - Using mock posts for visual testing, delete before commit
  const posts = mockPosts;
  // const posts = await getAllPosts();

  return (
    <>
      <StructuredData data={structuredData} />
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Typography.H1>{title}</Typography.H1>
          <Typography.TextLg className="text-default-600">
            {description}
          </Typography.TextLg>
        </div>
        <UnreleasedFeature>
          <SubscribeForm />
        </UnreleasedFeature>
        <BlogList posts={posts} />
      </section>
    </>
  );
};

export default Page;
