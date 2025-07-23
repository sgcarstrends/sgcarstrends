import type { Metadata } from "next";
import type { WebPage, WithContext } from "schema-dts";
import { PageHeader } from "@/components/page-header";
import { StructuredData } from "@/components/structured-data";
import { SITE_TITLE, SITE_URL } from "@/config";
import { generateCOEFAQSchema } from "@/lib/structured-data";
import { FAQSections } from "./faq-sections";

const title = "Frequently Asked Questions";
const description =
  "Common questions about Singapore's Certificate of Entitlement (COE) system, car registration trends, and automotive market dynamics.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/faq`,
    siteName: SITE_TITLE,
    locale: "en_SG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    site: "@sgcarstrends",
    creator: "@sgcarstrends",
  },
  alternates: {
    canonical: "/faq",
  },
};

const FAQPage = () => {
  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/faq`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  const faqSections = [
    {
      title: "Certificate of Entitlement (COE)",
      items: [
        {
          question: "What is COE in Singapore?",
          answer:
            "Certificate of Entitlement (COE) is a quota licence required in Singapore to own a vehicle. It gives the holder the right to register, purchase and use a vehicle in Singapore for a period of 10 years. The COE system was introduced in May 1990 to control vehicle population growth and manage traffic congestion.",
        },
        {
          question: "How does COE bidding work?",
          answer:
            "COE bidding exercises are held twice monthly, typically on the first and third Wednesday of each month. Bidders submit their bids for different vehicle categories through authorised dealers or online platforms. COE is awarded to the highest bidders up to the quota available for each category. The lowest successful bid becomes the COE price for that category.",
        },
        {
          question: "What are the COE categories?",
          answer:
            "There are 5 COE categories: Category A (cars up to 1,600cc and 130bhp, electric cars with power up to 110kW), Category B (cars above 1,600cc or 130bhp, electric cars with power above 110kW), Category C (goods vehicles and buses), Category D (motorcycles), and Category E (open category for all vehicle types).",
        },
        {
          question: "How long is COE valid?",
          answer:
            "COE is valid for 10 years from the date of vehicle registration. After 10 years, vehicle owners must either renew their COE for another 5 or 10 years by paying the Prevailing Quota Premium (PQP), or deregister their vehicle.",
        },
        {
          question: "What affects COE prices?",
          answer:
            "COE prices are determined by supply and demand. Key factors include the monthly quota set by the government (based on vehicle scrappage and target vehicle population growth), economic conditions, consumer confidence, interest rates, and seasonal demand patterns. External factors like global chip shortages or new model launches can also influence demand.",
        },
      ],
    },
    {
      title: "Car Registration and Market Trends",
      items: [
        {
          question: "How often is car registration data updated?",
          answer:
            "Car registration data is updated monthly following the Land Transport Authority's (LTA) official data releases. The data typically becomes available 2-3 weeks after the end of each month and includes comprehensive breakdowns by manufacturer, fuel type, and vehicle category.",
        },
        {
          question: "What data sources does SG Cars Trends use?",
          answer:
            "All vehicle registration and COE data is sourced directly from Singapore's Land Transport Authority (LTA), ensuring accuracy and official government backing. We process and format this data to provide insights and analytics for easier understanding of market trends.",
        },
        {
          question: "Why do some months show higher car registrations?",
          answer:
            "Car registration patterns can vary due to several factors including COE price fluctuations, new model launches, promotional periods by dealers, economic conditions, and seasonal buying patterns. Lower COE prices or attractive financing options typically lead to higher registrations.",
        },
      ],
    },
    {
      title: "Electric and Hybrid Vehicles",
      items: [
        {
          question: "How are electric vehicles categorised for COE?",
          answer:
            "Electric vehicles are categorised based on their power output: those with power up to 110kW fall under Category A, while those with power above 110kW are placed in Category B. This system treats electric vehicles similarly to petrol cars based on their performance characteristics.",
        },
        {
          question: "What incentives exist for electric vehicles?",
          answer:
            "Singapore offers various incentives for electric vehicles including rebates under the Electric Vehicle Early Adoption Incentive (EEAI), additional registration fee (ARF) rebates, and road tax concessions. The government aims to phase out internal combustion engine vehicles by 2040.",
        },
      ],
    },
    {
      title: "Using SG Cars Trends",
      items: [
        {
          question: "How can I access historical data?",
          answer:
            "Historical data is available through our website's month selector feature on various pages. You can also access our API endpoints for programmatic access to historical car registration and COE data dating back to 2020.",
        },
      ],
    },
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <StructuredData
        data={{ "@context": "https://schema.org", ...generateCOEFAQSchema() }}
      />
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Frequently Asked Questions"
          description="Common questions about Singapore's automotive market, COE system, and car registration trends."
        />
        <FAQSections sections={faqSections} />
      </div>
    </>
  );
};

export default FAQPage;
