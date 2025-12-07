import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import type { CarLogo } from "@logos/types";
import type { SelectCar } from "@sgcarstrends/database";
import { DataTable } from "@sgcarstrends/ui/components/data-table";
import { MakeSelector } from "@web/app/(dashboard)/cars/_components/make-selector";
import {
  CoeComparisonChart,
  MakeTrendChart,
} from "@web/app/(dashboard)/cars/_components/makes";
import { ShareButtons } from "@web/components/share-buttons";
import { LastUpdated } from "@web/components/shared/last-updated";
import NoData from "@web/components/shared/no-data";
import { columns } from "@web/components/tables/columns/cars-make-columns";
import Typography from "@web/components/typography";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import { SITE_TITLE, SITE_URL } from "@web/config";
import type { MakeCoeComparisonData } from "@web/queries/cars/makes/coe-comparison";
import type { Make } from "@web/types";
import Image from "next/image";

interface MakeDetailProps {
  make: string;
  cars: { make: string; total: number; data: Partial<SelectCar>[] };
  makes: Make[];
  lastUpdated?: number | null;
  logo?: CarLogo | null;
  coeComparison: MakeCoeComparisonData[];
}

export const MakeDetail = ({
  make,
  cars,
  makes,
  lastUpdated,
  logo,
  coeComparison,
}: MakeDetailProps) => {
  if (!cars) {
    return <NoData />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            {logo?.url && (
              <UnreleasedFeature>
                <Image
                  alt={`${cars.make} logo`}
                  src={logo.url}
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </UnreleasedFeature>
            )}
            <Typography.H1>{cars.make}</Typography.H1>
          </div>
          <div className="flex flex-col items-start gap-2">
            {!!lastUpdated && <LastUpdated lastUpdated={lastUpdated} />}
            <div className="flex items-center gap-2">
              <MakeSelector makes={makes} selectedMake={make} />
              <ShareButtons
                url={`${SITE_URL}/cars/makes/${make}`}
                title={`${cars.make} Cars - ${SITE_TITLE}`}
              />
            </div>
          </div>
        </div>
      </div>

      <Card className="p-4">
        <CardHeader>
          <div className="flex flex-col gap-1">
            <Typography.H3>Historical Trend</Typography.H3>
            <Typography.TextSm>Past registrations</Typography.TextSm>
          </div>
        </CardHeader>
        <CardBody>
          <MakeTrendChart data={cars.data.toReversed()} />
        </CardBody>
      </Card>

      <Card className="p-4">
        <CardHeader>
          <div className="flex flex-col">
            <Typography.H3>Registration vs COE Premium</Typography.H3>
            <Typography.TextSm>
              Correlation between registrations and COE premiums
            </Typography.TextSm>
          </div>
        </CardHeader>
        <CardBody>
          <CoeComparisonChart data={coeComparison} />
        </CardBody>
        <CardFooter>
          <p className="text-default-500 text-sm">
            Registration bars (left axis) show monthly vehicle purchases, while
            COE premium lines (right axis) display Category A and B prices.
            Rising premiums typically correlate with increased demand, though
            luxury makes may respond differently to Category B changes versus
            mass-market makes to Category A.
          </p>
        </CardFooter>
      </Card>

      <Card className="p-4">
        <CardHeader>
          <div className="flex flex-col gap-1">
            <Typography.H3>Summary</Typography.H3>
            <Typography.TextSm>
              Breakdown of fuel &amp; vehicle types by month
            </Typography.TextSm>
          </div>
        </CardHeader>
        <CardBody>
          <DataTable columns={columns} data={cars.data} />
        </CardBody>
      </Card>
    </div>
  );
};
