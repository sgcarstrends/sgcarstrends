import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import type { CarLogo } from "@logos/types";
import type { SelectCar } from "@sgcarstrends/database";
import { DataTable } from "@sgcarstrends/ui/components/data-table";
import {
  CoeComparisonChart,
  MakeTrendChart,
} from "@web/app/(dashboard)/cars/_components/makes";
import NoData from "@web/components/shared/no-data";
import { columns } from "@web/components/tables/columns/cars-make-columns";
import Typography from "@web/components/typography";
import type { MakeCoeComparisonData } from "@web/queries/cars/makes/coe-comparison";
import Image from "next/image";

interface MakeDetailProps {
  cars: { make: string; total: number; data: Partial<SelectCar>[] };
  coeComparison: MakeCoeComparisonData[];
  logo?: CarLogo | null;
}

export function MakeDetail({ cars, coeComparison, logo }: MakeDetailProps) {
  if (!cars) {
    return <NoData />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-4 pb-4">
        {logo?.url ? (
          <div className="relative size-20 overflow-hidden rounded-2xl bg-default-100 p-3">
            <Image
              fill
              src={logo.url}
              alt={`${cars.make} logo`}
              className="object-contain"
            />
          </div>
        ) : (
          <Avatar name={cars.make.charAt(0)} size="lg" color="primary" />
        )}
        <Typography.H2 className="text-center">{cars.make}</Typography.H2>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardBody className="text-center">
            <Typography.H3>{cars.total.toLocaleString()}</Typography.H3>
            <Typography.Caption>Total Registrations</Typography.Caption>
          </CardBody>
        </Card>
        <Card className="rounded-2xl">
          <CardBody className="text-center">
            <Typography.H3>
              {cars.data[0]?.number?.toLocaleString() ?? "N/A"}
            </Typography.H3>
            <Typography.Caption>This Month</Typography.Caption>
          </CardBody>
        </Card>
        <Card className="rounded-2xl">
          <CardBody className="text-center">
            <Typography.H3>{cars.data.length}</Typography.H3>
            <Typography.Caption>Months Tracked</Typography.Caption>
          </CardBody>
        </Card>
      </div>
      <Card className="rounded-2xl p-4">
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

      <Card className="rounded-2xl p-4">
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

      <Card className="rounded-2xl p-4">
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
}
