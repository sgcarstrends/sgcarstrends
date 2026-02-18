import type { CarLogo } from "@logos/types";
import { redis } from "@sgcarstrends/utils";
import { MakesDashboard } from "@web/app/(main)/(dashboard)/cars/components/makes";
import { SkeletonCard } from "@web/components/shared/skeleton";
import { StructuredData } from "@web/components/structured-data";
import { SITE_TITLE, SITE_URL } from "@web/config";
import { getPopularMakes } from "@web/queries/cars";
import {
  getGroupedMakes,
  getMakeRegistrationStats,
} from "@web/queries/cars/makes";
import type { MakeStats } from "@web/types";
import { Suspense } from "react";
import type { WebPage, WithContext } from "schema-dts";

const title = "Makes";
const description =
  "Comprehensive overview of car makes in Singapore. Explore popular brands, discover all available manufacturers, and view registration trends and market statistics.";

async function CarMakesContent() {
  const logos = await redis.get<CarLogo[]>("logos:all");
  const [{ sortedMakes, groupedMakes, letters }, popularMakes, statsArray] =
    await Promise.all([
      getGroupedMakes(),
      getPopularMakes(),
      getMakeRegistrationStats(),
    ]);

  const popular = popularMakes.map((item) => item.make);

  const makeStatsMap = statsArray.reduce<Record<string, MakeStats>>(
    (acc, { make, count, share, trend }) => {
      acc[make] = { count, share, trend };
      return acc;
    },
    {},
  );

  const structuredData: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `${SITE_URL}/cars/makes`,
    publisher: {
      "@type": "Organization",
      name: SITE_TITLE,
      url: SITE_URL,
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <MakesDashboard
        sortedMakes={sortedMakes}
        groupedMakes={groupedMakes}
        letters={letters}
        popularMakes={popular}
        logos={logos}
        makeStatsMap={makeStatsMap}
      />
    </>
  );
}

export function MakesContentSection() {
  return (
    <Suspense fallback={<SkeletonCard className="h-[560px] w-full" />}>
      <CarMakesContent />
    </Suspense>
  );
}
