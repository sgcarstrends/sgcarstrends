import type { SelectPost } from "@sgcarstrends/database";
import type { Highlight } from "@web/app/blog/_components/key-highlights";

/**
 * Mock posts for testing the new Hybrid blog layout
 *
 * These posts are only visible when NEXT_PUBLIC_FEATURE_FLAG_UNRELEASED=true
 * They include heroImage and highlights to showcase the new editorial design.
 */

// Hero images from Unsplash (EV/car themed)
const HERO_IMAGES = {
  evCharging:
    "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&h=514&fit=crop",
  teslaWhite:
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&h=514&fit=crop",
  cityTraffic:
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=514&fit=crop",
  carShowroom:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=514&fit=crop",
};

// Sample highlights for testing Key Highlights component
const sampleHighlights: Highlight[] = [
  {
    value: "52.60%",
    label: "Electric Vehicles Lead",
    detail: "2,081 units registered in October 2025",
  },
  {
    value: "36.48%",
    label: "Hybrids Remain Strong",
    detail: "1,443 combined hybrid registrations",
  },
  {
    value: "1,050",
    label: "BYD Tops Brands",
    detail: "Leading by strong EV lineup",
  },
  {
    value: "60.54%",
    label: "SUVs Dominate",
    detail: "2,395 units of all new registrations",
  },
  {
    value: "10.92%",
    label: "Petrol Decline",
    detail: "Significant drop in market share",
  },
];

const now = new Date();
const oneDay = 24 * 60 * 60 * 1000;

export const mockPosts: SelectPost[] = [
  {
    id: "mock-1",
    title: "Electric Vehicles Dominate Singapore November 2025",
    slug: "mock-ev-november-2025",
    content: `## Executive Summary

Singapore's car market in November 2025 continues its remarkable shift towards electrification, with Electric Vehicles (EVs) maintaining their dominant position.

## Fuel Type Analysis

| Fuel Type | Registrations | Percentage |
|-----------|---------------|------------|
| Electric | 2,150 | 54.20% |
| Petrol-Electric | 1,280 | 32.30% |
| Petrol | 420 | 10.60% |
| Others | 115 | 2.90% |

## Conclusion

The trend towards electrification shows no signs of slowing down.`,
    status: "published",
    createdAt: new Date(now.getTime() - oneDay),
    modifiedAt: new Date(now.getTime() - oneDay),
    publishedAt: new Date(now.getTime() - oneDay),
    heroImage: HERO_IMAGES.evCharging,
    highlights: sampleHighlights,
    excerpt:
      "Singapore's November 2025 car market sees EVs claim over 54% of new registrations, continuing the electrification momentum.",
    tags: ["Electric Vehicles", "Market Analysis", "November 2025"],
    month: "2025-11",
    dataType: "cars",
    metadata: {
      featured: true,
    },
  },
  {
    id: "mock-2",
    title: "COE Prices Surge in Second Bidding Round",
    slug: "mock-coe-surge-2025",
    content: `## Overview

The Certificate of Entitlement (COE) prices saw significant increases across all categories in the latest bidding round.

## Category Breakdown

| Category | Previous | Current | Change |
|----------|----------|---------|--------|
| Cat A | $85,000 | $92,500 | +8.8% |
| Cat B | $110,000 | $125,000 | +13.6% |
| Cat C | $72,000 | $78,500 | +9.0% |

## Market Analysis

The surge reflects continued strong demand despite economic headwinds.`,
    status: "published",
    createdAt: new Date(now.getTime() - 2 * oneDay),
    modifiedAt: new Date(now.getTime() - 2 * oneDay),
    publishedAt: new Date(now.getTime() - 2 * oneDay),
    heroImage: HERO_IMAGES.cityTraffic,
    highlights: [
      {
        value: "$125,000",
        label: "Cat B COE",
        detail: "Highest in 6 months",
      },
      {
        value: "+13.6%",
        label: "Biggest Jump",
        detail: "Category B leads increases",
      },
      {
        value: "2,847",
        label: "Total Bids",
        detail: "Strong demand continues",
      },
    ],
    excerpt:
      "COE prices climb across all categories with Cat B seeing the largest jump at 13.6%.",
    tags: ["COE", "Bidding Results", "Market Trends"],
    month: "2025-11",
    dataType: "coe",
    metadata: {
      featured: false,
    },
  },
  {
    id: "mock-3",
    title: "BYD Overtakes Tesla as Top EV Brand in Singapore",
    slug: "mock-byd-overtakes-tesla",
    content: `## Market Shift

In a significant market shift, BYD has overtaken Tesla as the leading electric vehicle brand in Singapore.

## Brand Rankings

| Rank | Brand | Units | Market Share |
|------|-------|-------|--------------|
| 1 | BYD | 1,250 | 28.5% |
| 2 | Tesla | 980 | 22.3% |
| 3 | Mercedes | 450 | 10.2% |
| 4 | BMW | 380 | 8.6% |

## Analysis

BYD's competitive pricing and expanded model lineup have driven this change.`,
    status: "published",
    createdAt: new Date(now.getTime() - 3 * oneDay),
    modifiedAt: new Date(now.getTime() - 3 * oneDay),
    publishedAt: new Date(now.getTime() - 3 * oneDay),
    heroImage: HERO_IMAGES.carShowroom,
    highlights: [
      {
        value: "28.5%",
        label: "BYD Market Share",
        detail: "Now #1 EV brand in Singapore",
      },
      {
        value: "1,250",
        label: "BYD Units Sold",
        detail: "Up 45% from previous month",
      },
      {
        value: "6.2%",
        label: "Lead Over Tesla",
        detail: "Gap widening each month",
      },
    ],
    excerpt:
      "BYD captures 28.5% of the EV market, surpassing Tesla with competitive pricing strategy.",
    tags: ["Electric Vehicles", "BYD", "Tesla", "Brand Analysis"],
    month: "2025-10",
    dataType: "cars",
    metadata: {
      featured: false,
    },
  },
  {
    id: "mock-hybrid-showcase",
    title:
      "Hybrid Car Market Analysis: The Rise of Electrified Powertrains in Singapore",
    slug: "mock-hybrid-market-analysis",
    content: `## Executive Summary

Singapore's automotive landscape is undergoing a profound transformation as hybrid vehicles establish themselves as a compelling middle ground between traditional combustion engines and fully electric powertrains. This comprehensive analysis examines the current state of the hybrid market, consumer preferences, and future projections.

## Market Overview

The hybrid segment has experienced remarkable growth over the past year, driven by a combination of government incentives, improved technology, and shifting consumer attitudes towards sustainability.

| Metric | Q3 2025 | Q2 2025 | Change |
|--------|---------|---------|--------|
| Total Hybrid Sales | 1,847 | 1,523 | +21.3% |
| Market Share | 36.5% | 31.2% | +5.3pp |
| Average Price | $125,000 | $128,000 | -2.3% |
| Models Available | 42 | 38 | +10.5% |

## Fuel Efficiency Analysis

Hybrid vehicles in Singapore demonstrate exceptional fuel efficiency, particularly suited to the city-state's urban driving conditions with frequent stop-and-go traffic.

> "The regenerative braking systems in modern hybrids are perfectly optimised for Singapore's driving patterns, recovering up to 70% of kinetic energy during deceleration."

### Top Performers by Efficiency

| Model | Combined Efficiency | City Rating | Highway Rating |
|-------|--------------------:|------------:|---------------:|
| Toyota Prius | 4.1 L/100km | 3.8 | 4.4 |
| Honda Civic Hybrid | 4.3 L/100km | 4.0 | 4.6 |
| Lexus UX 250h | 4.5 L/100km | 4.2 | 4.8 |
| BMW 330e | 1.9 L/100km* | 1.7 | 2.1 |

*PHEV with electric-only capability

## Consumer Sentiment

Our survey of 2,500 Singaporean car buyers reveals interesting insights into hybrid adoption drivers:

- **45%** cited lower running costs as the primary motivation
- **32%** were influenced by environmental concerns
- **18%** valued the convenience of not requiring charging infrastructure
- **5%** mentioned resale value considerations

## Future Outlook

The hybrid segment is expected to maintain strong growth through 2026, though the trajectory may shift as EV infrastructure expands and battery costs continue to decline.

### Key Trends to Watch

1. **Plug-in Hybrid Evolution**: PHEVs with extended electric ranges (50km+) gaining traction
2. **Premium Segment Growth**: Luxury brands expanding hybrid offerings
3. **Used Market Development**: Growing secondary market for certified pre-owned hybrids
4. **Technology Integration**: Advanced driver assistance systems becoming standard

## Conclusion

Hybrid vehicles represent a pragmatic choice for Singapore's evolving automotive market. While the long-term trajectory points towards full electrification, hybrids serve as an essential bridge technology, offering immediate environmental benefits without the infrastructure concerns of pure EVs.

The data suggests that this segment will remain robust through at least 2027, providing consumers with a viable pathway to reduce their carbon footprint while maintaining the flexibility and convenience of traditional refuelling.`,
    status: "published",
    createdAt: new Date(now.getTime() - 4 * oneDay),
    modifiedAt: new Date(now.getTime() - 4 * oneDay),
    publishedAt: new Date(now.getTime() - 4 * oneDay),
    heroImage: HERO_IMAGES.teslaWhite,
    highlights: [
      {
        value: "36.5%",
        label: "Hybrid Market Share",
        detail: "Up 5.3pp from previous quarter",
      },
      {
        value: "+21.3%",
        label: "Sales Growth",
        detail: "1,847 units sold in Q3 2025",
      },
      {
        value: "42",
        label: "Models Available",
        detail: "10.5% increase in choice",
      },
      {
        value: "4.1L",
        label: "Best Efficiency",
        detail: "Toyota Prius leads the segment",
      },
      {
        value: "45%",
        label: "Cost-Driven Buyers",
        detail: "Primary purchase motivation",
      },
      {
        value: "2027",
        label: "Growth Horizon",
        detail: "Projected strong demand",
      },
    ],
    excerpt:
      "A comprehensive analysis of Singapore's hybrid vehicle market, examining growth trends, consumer preferences, and the role of electrified powertrains in the transition to sustainable mobility.",
    tags: ["Hybrid Vehicles", "Market Analysis", "Sustainability", "Trends"],
    month: "2025-09",
    dataType: "cars",
    metadata: {
      featured: true,
    },
  },
];

/**
 * Marks a post ID as a mock post for visual identification
 */
export const isMockPost = (postId: string): boolean => {
  return postId.startsWith("mock-");
};
