import type { BlogPost, BlogMetadata } from "@web/types";

const blogPosts: BlogPost[] = [
  {
    slug: "singapore-car-market-trends-2024",
    title: "Singapore Car Market Trends in 2024: What the Data Reveals",
    excerpt:
      "Analysing the latest car registration data and COE trends to understand how the Singapore automotive market evolved in 2024.",
    content: `The Singapore car market has seen significant changes in 2024, with electric vehicles gaining traction and COE premiums reaching new heights.

## Electric Vehicle Adoption

Electric vehicles have shown remarkable growth in 2024, with registrations increasing by 45% compared to 2023. This surge can be attributed to:

- Enhanced charging infrastructure across Singapore
- Government incentives for EV adoption
- Improved battery technology and range

## COE Premium Trends

Certificate of Entitlement (COE) premiums have continued their upward trajectory, with Category A vehicles seeing an average premium of S$95,000 in the first half of 2024.

## Popular Vehicle Makes

The data shows Tesla leading in the luxury EV segment, while Toyota maintains its dominance in the hybrid category.`,
    publishedDate: "2024-12-15",
    author: "SGCarsTrends Team",
    tags: ["market trends", "COE", "electric vehicles", "2024"],
    readingTime: 5,
    featured: true,
    modelName: "Gemini 2.5 Pro",
  },
  {
    slug: "understanding-coe-system-singapore",
    title: "Understanding Singapore's COE System: A Complete Guide",
    excerpt:
      "Everything you need to know about the Certificate of Entitlement system and how it affects car ownership in Singapore.",
    content: `Singapore's Certificate of Entitlement (COE) system is unique globally and plays a crucial role in vehicle ownership decisions.

## What is COE?

The COE is a quota license that allows the holder to register, own and use a vehicle in Singapore for a period of 10 years.

## Categories Explained

- **Category A**: Cars up to 1600cc and 130bhp, electric cars up to 110kW
- **Category B**: Cars above 1600cc or 130bhp, electric cars above 110kW  
- **Category C**: Goods vehicles and buses
- **Category D**: Motorcycles
- **Category E**: Open category (can bid for Categories A & B)

## Bidding Process

The COE bidding exercise is conducted twice monthly, typically in the first and third weeks of each month.`,
    publishedDate: "2024-11-28",
    author: "SGCarsTrends Team",
    tags: ["COE", "guide", "singapore", "car ownership"],
    readingTime: 8,
    featured: false,
    modelName: "Gemini 2.5 Pro",
  },
];

export const getAllBlogPosts = (): BlogPost[] =>
  blogPosts.sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
  );

export const getFeaturedBlogPosts = (): BlogPost[] =>
  blogPosts.filter((post) => post.featured);

export const getBlogPostBySlug = (slug: string): BlogPost | undefined =>
  blogPosts.find((post) => post.slug === slug);

export const getBlogPostMetadata = (): BlogMetadata[] =>
  blogPosts.map(({ slug, content, readingTime, ...metadata }) => metadata);

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};
