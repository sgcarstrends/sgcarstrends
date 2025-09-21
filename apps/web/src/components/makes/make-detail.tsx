import { columns } from "@web/app/cars/makes/[make]/columns";
import type { Logo } from "@web/app/cars/makes/[make]/page";
import { LastUpdated } from "@web/components/last-updated";
import { MakeSelector } from "@web/components/make-selector";
import { MakeTrendChart } from "@web/components/makes";
import NoData from "@web/components/no-data";
import Typography from "@web/components/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { DataTable } from "@web/components/ui/data-table";
import { UnreleasedFeature } from "@web/components/unreleased-feature";
import type { Car, Make } from "@web/types";
import Image from "next/image";

interface MakeDetailProps {
  make: string;
  cars: { make: string; total: number; data: Car[] };
  makes: Make[];
  lastUpdated?: number | null;
  logo?: Logo; // TODO: Interim fix
}

export const MakeDetail = ({
  make,
  cars,
  makes,
  lastUpdated,
  logo,
}: MakeDetailProps) => {
  if (!cars) {
    return <NoData />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
          <div className="flex flex-col items-center">
            {logo?.url && (
              <UnreleasedFeature>
                <Image
                  alt={`${cars.make} logo`}
                  src={logo.url}
                  width={128}
                  height={128}
                />
              </UnreleasedFeature>
            )}
            <Typography.H1>{cars.make}</Typography.H1>
          </div>
          <div className="flex flex-col items-start gap-2">
            {lastUpdated && <LastUpdated lastUpdated={lastUpdated} />}
            <MakeSelector makes={makes} selectedMake={make} />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historical Trend</CardTitle>
          <CardDescription>Past registrations</CardDescription>
        </CardHeader>
        <CardContent>
          <MakeTrendChart data={cars.data.toReversed()} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            Breakdown of fuel &amp; vehicle types by month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={cars.data} />
        </CardContent>
      </Card>
    </div>
  );
};
