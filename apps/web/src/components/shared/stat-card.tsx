"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { BarChartByType } from "@web/app/(dashboard)/cars/bar-chart-by-type";
import Typography from "@web/components/typography";
import { FUEL_TYPE } from "@web/config";
import type { RegistrationStat } from "@web/types/cars";

interface Props {
  title: string;
  description: string;
  data: RegistrationStat[];
  total: number;
}

export function StatCard({ title, description, data }: Props) {
  return (
    <Card className="p-3">
      <CardHeader className="flex flex-col items-start gap-2">
        <Typography.H4>{title}</Typography.H4>
        <Typography.TextSm>{description}</Typography.TextSm>
      </CardHeader>
      <CardBody className="flex-1">
        <BarChartByType data={data} />
        {Object.keys(data).includes(FUEL_TYPE.OTHERS) && (
          <p className="text-muted-foreground italic">
            <Typography.TextSm>
              Note: We do not know what is the Land Transport Authority&apos;s
              exact definition of &quot;Others&quot;.
            </Typography.TextSm>
          </p>
        )}
        {/*<Table>*/}
        {/*  <TableHeader>*/}
        {/*    <TableRow>*/}
        {/*      <TableHead>Type</TableHead>*/}
        {/*      <TableHead>Count</TableHead>*/}
        {/*      <TableHead>Distribution</TableHead>*/}
        {/*    </TableRow>*/}
        {/*  </TableHeader>*/}
        {/*  <TableBody>*/}
        {/*    {data.map(({ name, count }) => {*/}
        {/*      return (*/}
        {/*        <TableRow*/}
        {/*          key={name}*/}
        {/*          className="cursor-pointer"*/}
        {/*          onClick={() => handleRowClick(name)}*/}
        {/*        >*/}
        {/*          <TableCell>*/}
        {/*            <div className="flex flex-col gap-2">{name}</div>*/}
        {/*          </TableCell>*/}
        {/*          <TableCell className="text-primary flex gap-1 font-semibold">*/}
        {/*            {count}*/}
        {/*          </TableCell>*/}
        {/*          <TableCell>*/}
        {/*            <Badge variant={getBadgeVariant(count)}>*/}
        {/*              {formatPercent(count / total, {*/}
        {/*                minimumFractionDigits: 2,*/}
        {/*              })}*/}
        {/*            </Badge>*/}
        {/*          </TableCell>*/}
        {/*          <TableCell>*/}
        {/*            <ArrowRight className="text-primary size-4" />*/}
        {/*          </TableCell>*/}
        {/*        </TableRow>*/}
        {/*      );*/}
        {/*    })}*/}
        {/*  </TableBody>*/}
        {/*</Table>*/}
      </CardBody>
    </Card>
  );
}
