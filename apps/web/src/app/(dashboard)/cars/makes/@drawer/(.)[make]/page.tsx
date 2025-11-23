import { MakeDrawer } from "@web/app/(dashboard)/cars/_components/makes";
import { MakeDetail } from "@web/app/(dashboard)/cars/_components/makes/make-detail";
import { CACHE_TAG } from "@web/lib/cache";
import { fetchMakePageData } from "@web/lib/cars/make-data";
import { getMakeCoeComparison } from "@web/queries/cars/makes/coe-comparison";
import { cacheLife, cacheTag } from "next/cache";

interface Props {
  params: Promise<{ make: string }>;
}

const MakePage = async ({ params }: Props) => {
  "use cache";
  cacheLife("max");
  cacheTag(CACHE_TAG.CARS);

  const { make } = await params;

  const [{ cars, makes, lastUpdated }, coeComparison] = await Promise.all([
    fetchMakePageData(make),
    getMakeCoeComparison(make),
  ]);

  return (
    <MakeDrawer>
      <MakeDetail
        make={make}
        cars={cars}
        makes={makes}
        lastUpdated={lastUpdated}
        coeComparison={coeComparison}
      />
    </MakeDrawer>
  );
};

export default MakePage;
