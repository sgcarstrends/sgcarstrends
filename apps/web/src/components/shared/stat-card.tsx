"use client";

import slugify from "@sindresorhus/slugify";
import { BarChartByType } from "@web/app/(dashboard)/cars/bar-chart-by-type";
import Typography from "@web/components/typography";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@web/components/ui/card";
import { FUEL_TYPE } from "@web/config";
import type { RegistrationStat } from "@web/types/cars";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  title: string;
  description: string;
  data: RegistrationStat[];
  total: number;
  // TODO: Temporary solution
  linkPrefix?: string;
}

export const StatCard = ({
  title,
  description,
  data,
  total,
  // TODO: Temporary solution
  linkPrefix,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const _handleRowClick = (type: string) => {
    router.push(`/cars/${linkPrefix}/${slugify(type)}?${searchParams}`);
  };

  const _getBadgeVariant = (value: number) => {
    const percentage = (value / total) * 100;
    if (percentage > 30) return "default";
    if (percentage > 15) return "secondary";
    return "outline";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
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
      </CardContent>
    </Card>
  );
};
