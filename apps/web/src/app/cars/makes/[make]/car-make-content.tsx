import Image from "next/image";
import { columns } from "@web/app/cars/makes/[make]/columns";
import type { Logo } from "@web/app/cars/makes/[make]/page";
import { TrendChart } from "@web/app/cars/makes/[make]/trend-chart";
import { LastUpdated } from "@web/components/last-updated";
import { MakeSelector } from "@web/components/make-selector";
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

interface CarMakeContentProps {
  make: string;
  cars: { make: string; total: number; data: Car[] };
  makes: Make[];
  lastUpdated?: number | null;
  logo?: Logo; // TODO: Interim fix
}

export function CarMakeContent({
  make,
  cars,
  makes,
  lastUpdated,
  logo,
}: CarMakeContentProps) {
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
          <TrendChart data={cars.data.toReversed()} />
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
}
