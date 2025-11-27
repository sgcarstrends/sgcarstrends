import { slugify } from "@sgcarstrends/utils";
import { MakeDrawer } from "@web/app/(dashboard)/cars/_components/makes";
import { MakeDetail } from "@web/app/(dashboard)/cars/_components/makes/make-detail";
import { fetchMakePageData } from "@web/lib/cars/make-data";
import { getDistinctMakes } from "@web/queries/cars";
import { getMakeCoeComparison } from "@web/queries/cars/makes/coe-comparison";

interface Props {
  params: Promise<{ make: string }>;
}

export const generateStaticParams = async () => {
  const allMakes = await getDistinctMakes();
  return allMakes.map(({ make }) => ({ make: slugify(make) }));
};

const MakePage = async ({ params }: Props) => {
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
