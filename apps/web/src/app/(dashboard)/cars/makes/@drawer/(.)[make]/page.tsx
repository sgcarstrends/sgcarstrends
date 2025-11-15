"use cache";

import { MakeDrawer } from "@web/app/(dashboard)/cars/_components/makes";
import { MakeDetail } from "@web/app/(dashboard)/cars/_components/makes/make-detail";
import { fetchMakePageData } from "@web/lib/cars/make-data";

interface Props {
  params: Promise<{ make: string }>;
}

const MakePage = async ({ params }: Props) => {
  const { make } = await params;

  const { cars, makes, lastUpdated } = await fetchMakePageData(make);

  return (
    <MakeDrawer>
      <MakeDetail
        make={make}
        cars={cars}
        makes={makes}
        lastUpdated={lastUpdated}
      />
    </MakeDrawer>
  );
};

export default MakePage;
