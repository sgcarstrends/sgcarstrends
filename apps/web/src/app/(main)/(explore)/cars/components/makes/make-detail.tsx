import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardHeader } from "@heroui/card";
import type { CarLogo } from "@logos/types";
import type { SelectCar } from "@sgcarstrends/database";
import { DataTable } from "@sgcarstrends/ui/components/data-table";
import {
  CoeComparisonChart,
  MakeTrendChart,
  TypeBreakdownChart,
} from "@web/app/(main)/(explore)/cars/components/makes";
import { EmptyState } from "@web/components/shared/empty-state";
import { columns } from "@web/components/tables/columns/cars-make-columns";
import Typography from "@web/components/typography";
import type { MakeCoeComparisonData } from "@web/queries/cars/makes/coe-comparison";
import { Calendar, Car, TrendingUp } from "lucide-react";
import Image from "next/image";

interface MakeDetailProps {
  cars: { make: string; total: number; data: Partial<SelectCar>[] } | null;
  coeComparison: MakeCoeComparisonData[];
  logo?: CarLogo | null;
  fuelTypeBreakdown?: { name: string; value: number }[];
  vehicleTypeBreakdown?: { name: string; value: number }[];
}

export function MakeDetail({
  cars,
  coeComparison,
  logo,
  fuelTypeBreakdown = [],
  vehicleTypeBreakdown = [],
}: MakeDetailProps) {
  if (!cars) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header with logo and make name */}
      <div className="flex items-center gap-4 border-default-100 border-b pb-6">
        <div className="flex size-16 items-center justify-center">
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={`${cars.make} logo`}
              width={48}
              height={48}
              className="object-contain"
            />
          ) : (
            <Avatar
              name={cars.make.charAt(0)}
              classNames={{
                base: "size-full bg-primary",
                name: "text-xl font-semibold text-primary-foreground",
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Typography.H2>{cars.make}</Typography.H2>
          <Typography.TextSm>Vehicle Registrations</Typography.TextSm>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-2 rounded-2xl bg-default-100 p-4">
          <div className="flex items-center gap-2">
            <Car className="size-3.5 text-primary" />
            <Typography.Caption className="text-primary">
              Total
            </Typography.Caption>
          </div>
          <span className="font-bold text-primary text-xl tabular-nums">
            {cars.total.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl bg-default-100 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-3.5 text-success" />
            <Typography.Caption className="text-success">
              This Month
            </Typography.Caption>
          </div>
          <span className="font-bold text-foreground text-xl tabular-nums">
            {cars.data[0]?.number?.toLocaleString() ?? "N/A"}
          </span>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl bg-default-100 p-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 text-default-500" />
            <Typography.Caption>Tracked</Typography.Caption>
          </div>
          <span className="font-bold text-foreground text-xl tabular-nums">
            {cars.data.length}
            <span className="ml-1 font-normal text-default-400 text-sm">
              mo
            </span>
          </span>
        </div>
      </div>

      {/* Historical Trend Chart */}
      <Card className="rounded-2xl p-3">
        <CardHeader className="flex flex-row items-baseline justify-between">
          <Typography.H4>Historical Trend</Typography.H4>
          <Typography.Caption>Past registrations</Typography.Caption>
        </CardHeader>
        <CardBody>
          <MakeTrendChart data={cars.data.toReversed()} />
        </CardBody>
      </Card>

      {/* Fuel & Vehicle Type Breakdown Charts */}
      {(fuelTypeBreakdown.length > 0 || vehicleTypeBreakdown.length > 0) && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {fuelTypeBreakdown.length > 0 && (
            <TypeBreakdownChart
              data={fuelTypeBreakdown}
              title="Fuel Type Breakdown"
              description="Registrations by fuel type"
            />
          )}
          {vehicleTypeBreakdown.length > 0 && (
            <TypeBreakdownChart
              data={vehicleTypeBreakdown}
              title="Vehicle Type Breakdown"
              description="Registrations by vehicle type"
            />
          )}
        </div>
      )}

      {/* COE Comparison Chart */}
      <Card className="rounded-2xl p-3">
        <CardHeader className="flex flex-col items-start gap-2">
          <Typography.H4>Registration vs COE Premium</Typography.H4>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <CoeComparisonChart data={coeComparison} />
          <Typography.Caption>
            Bars show monthly registrations (left axis), lines show COE Category
            A and B premiums (right axis).
          </Typography.Caption>
        </CardBody>
      </Card>

      {/* Summary Table */}
      <Card className="rounded-2xl p-3">
        <CardHeader className="flex flex-row items-baseline justify-between">
          <Typography.H4>Summary</Typography.H4>
          <Typography.Caption>Fuel & vehicle types by month</Typography.Caption>
        </CardHeader>
        <CardBody className="p-0">
          <DataTable columns={columns} data={cars.data} />
        </CardBody>
      </Card>
    </div>
  );
}
