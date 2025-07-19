import Image from "next/image";
import { columns } from "@/app/cars/makes/[make]/columns";
import { TrendChart } from "@/app/cars/makes/[make]/trend-chart";
import { LastUpdated } from "@/components/last-updated";
import { MakeSelector } from "@/components/make-selector";
import NoData from "@/components/no-data";
import Typography from "@/components/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { UnreleasedFeature } from "@/components/unreleased-feature";
import { type Car, type Make } from "@/types";

interface CarMakeContentProps {
  make: string;
  cars: { make: string; total: number; data: Car[] };
  makes: Make[];
  lastUpdated?: number | null;
  logoUrl?: string | null;
}

export function CarMakeContent({
  make,
  cars,
  makes,
  lastUpdated,
  logoUrl,
}: CarMakeContentProps) {
  if (!cars) {
    return <NoData />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
          <div className="flex flex-col items-center">
            <UnreleasedFeature>
              {logoUrl && (
                <Image
                  alt={`${cars.make} logo`}
                  src={logoUrl}
                  width={128}
                  height={128}
                />
              )}
            </UnreleasedFeature>
            <Typography.H1>{cars.make}</Typography.H1>
          </div>
          <div className="flex flex-row-reverse items-center justify-between gap-2 lg:flex-row">
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
