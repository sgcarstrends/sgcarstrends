import { redis } from "@sgcarstrends/utils";
import {
  LAST_UPDATED_CARS_KEY,
  LAST_UPDATED_COE_KEY,
  SITE_TITLE,
  SITE_URL,
} from "@web/config";
import { getCarsLatestMonth, getCOELatestMonth } from "@web/lib/data/months";
import { getAllPosts } from "@web/lib/data/posts";
import {
  getDistinctFuelTypes,
  getDistinctVehicleTypes,
  getPopularMakes,
} from "@web/queries/cars";
import { getLatestCOEResults } from "@web/queries/coe";

export const GET = async () => {
  // Fetch all dynamic data in parallel
  const [
    carsLatestMonth,
    coeLatestMonth,
    popularMakes,
    fuelTypes,
    vehicleTypes,
    recentPosts,
    latestCOE,
    carsLastUpdated,
    coeLastUpdated,
  ] = await Promise.all([
    getCarsLatestMonth(),
    getCOELatestMonth(),
    getPopularMakes(),
    getDistinctFuelTypes(),
    getDistinctVehicleTypes(),
    getAllPosts().then((posts) => posts.slice(0, 10)),
    getLatestCOEResults(),
    redis.get<number>(LAST_UPDATED_CARS_KEY),
    redis.get<number>(LAST_UPDATED_COE_KEY),
  ]);

  // Extract unique COE categories from latest results
  const coeCategories = [
    ...new Set(latestCOE.map((r) => r.vehicleClass)),
  ].filter(Boolean);

  // Format fuel types for display
  const fuelTypesList = fuelTypes.map((f) => f.fuelType).join(", ");

  // Format vehicle types for display
  const vehicleTypesList = vehicleTypes.map((v) => v.vehicleType).join(", ");

  // Format last updated dates
  const carsLastUpdatedDate = carsLastUpdated
    ? new Date(carsLastUpdated).toISOString()
    : "unknown";
  const coeLastUpdatedDate = coeLastUpdated
    ? new Date(coeLastUpdated).toISOString()
    : "unknown";

  const content = `# ${SITE_TITLE}

> Singapore's comprehensive platform for vehicle registration data, COE (Certificate of Entitlement) bidding results, and automotive market insights. Access historical trends, market analysis, and AI-generated blog content about Singapore's car market.

${SITE_TITLE} provides real-time access to Singapore's official vehicle registration statistics and COE bidding results from the Land Transport Authority (LTA). The platform features interactive charts, market comparisons, and data-driven insights for car buyers, automotive industry professionals, and data analysts.

## Data Freshness

- Cars data: Latest month **${carsLatestMonth}** (last updated: ${carsLastUpdatedDate})
- COE data: Latest month **${coeLatestMonth}** (last updated: ${coeLastUpdatedDate})
- Available fuel types: ${fuelTypesList}
- Available vehicle types: ${vehicleTypesList}
- COE categories in database: ${coeCategories.join(", ")}

## Popular Car Makes (Current Year)

${popularMakes.join(", ")}

## Main Sections

- [Dashboard](${SITE_URL}): Latest COE results, market trends, and key statistics
- [Cars](${SITE_URL}/cars): Vehicle registration data and analytics
- [COE Overview](${SITE_URL}/coe): Certificate of Entitlement bidding results
- [Blog](${SITE_URL}/blog): AI-generated market insights and automotive analysis

## Car Registration Data

- [New Registrations](${SITE_URL}/cars): Monthly vehicle registration statistics
- [Cars by Make](${SITE_URL}/cars/makes): Browse registrations by manufacturer
- [All Makes Directory](${SITE_URL}/cars/makes): Complete list of car manufacturers
- [Electric Vehicles](${SITE_URL}/cars/fuel-types/electric): BEV registration data
- [Hybrid Vehicles](${SITE_URL}/cars/fuel-types/petrol-electric): Petrol-electric hybrid data
- [Plug-in Hybrids](${SITE_URL}/cars/fuel-types/petrol-electric-plug-in): PHEV statistics
- [Diesel Vehicles](${SITE_URL}/cars/fuel-types/diesel): Diesel registration data
- [Petrol Vehicles](${SITE_URL}/cars/fuel-types/petrol): Petrol registration statistics
- [SUVs](${SITE_URL}/cars/vehicle-types/sports-utility-vehicle): Sport utility vehicle data
- [Sedans](${SITE_URL}/cars/vehicle-types/sedan): Sedan registration statistics
- [Hatchbacks](${SITE_URL}/cars/vehicle-types/hatchback): Hatchback vehicle data
- [MPVs](${SITE_URL}/cars/vehicle-types/multi-purpose-vehicle): Multi-purpose vehicle statistics

## COE Bidding Results

- [COE Overview](${SITE_URL}/coe): Current COE landscape and bidding results
- [Latest COE Results](${SITE_URL}/coe/latest): Most recent bidding outcomes
- [Historical Results](${SITE_URL}/coe/results): Complete bidding history
- [COE Trends](${SITE_URL}/coe/trends): Price trends and pattern analysis
- [Bidding Results](${SITE_URL}/coe/bidding): Detailed bidding data
- [PQP Rates](${SITE_URL}/coe/pqp): Prevailing Quota Premium rates
- [Category A](${SITE_URL}/coe/categories/a): Cars up to 1600cc and 97kW
- [Category B](${SITE_URL}/coe/categories/b): Cars above 1600cc or 97kW
- [Category C](${SITE_URL}/coe/categories/c): Goods vehicles and buses
- [Category D](${SITE_URL}/coe/categories/d): Motorcycles
- [Category E](${SITE_URL}/coe/categories/e): Open category

## Recent Blog Posts

${recentPosts.map((post) => `- [${post.title}](${SITE_URL}/blog/${post.slug})`).join("\n")}

## API & Documentation

- [API Documentation](https://docs.sgcarstrends.com): Complete REST API reference
- [Interactive API Explorer](https://api.sgcarstrends.com): Scalar-powered API docs
- [Quickstart Guide](https://docs.sgcarstrends.com/quickstart): Get started with the API
- [Authentication](https://docs.sgcarstrends.com/authentication): API authentication guide
- [Data Models](https://docs.sgcarstrends.com/guides/data-models): Understanding data structures
- [Filtering Guide](https://docs.sgcarstrends.com/guides/filtering): Query parameters and filters
- [API Reference](https://docs.sgcarstrends.com/api-reference): Endpoint documentation

## Architecture & Development

- [System Architecture](https://docs.sgcarstrends.com/architecture/system): Overall system design
- [API Architecture](https://docs.sgcarstrends.com/architecture/api): Hono framework structure
- [Database Schema](https://docs.sgcarstrends.com/architecture/database): PostgreSQL schema
- [Workflows](https://docs.sgcarstrends.com/architecture/workflows): Data processing automation
- [Infrastructure](https://docs.sgcarstrends.com/architecture/infrastructure): AWS deployment with SST
- [Social Integration](https://docs.sgcarstrends.com/architecture/social): Social media automation

## About & Information

- [About](${SITE_URL}/about): About ${SITE_TITLE} platform
- [FAQ](${SITE_URL}/faq): Frequently asked questions
- [Contact](${SITE_URL}/contact): Get in touch with the team
- [Visitors](${SITE_URL}/visitors): Platform analytics and visitor information

## Optional

- [Privacy Policy](${SITE_URL}/legal/privacy-policy): Data privacy and usage policy
- [Terms of Service](${SITE_URL}/legal/terms-of-service): Terms and conditions
- [GitHub Repository](https://github.com/sgcarstrends/sgcarstrends): Open source codebase
- [Twitter/X](${SITE_URL}/twitter): Follow us on X
- [LinkedIn](${SITE_URL}/linkedin): Connect on LinkedIn
- [Telegram](${SITE_URL}/telegram): Join our Telegram channel
- [Discord](${SITE_URL}/discord): Join our Discord community
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
