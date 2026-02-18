import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { formatPercentage, slugify } from "@sgcarstrends/utils";
import { Sparkline } from "@web/components/charts/sparkline";
import Typography from "@web/components/typography";
import type { Make } from "@web/types";
import Image from "next/image";
import Link from "next/link";

interface MakeCardProps {
  make: Make;
  logoUrl?: string;
  count?: number;
  share?: number;
  trend?: { value: number }[];
}

export function MakeCard({
  make,
  logoUrl,
  count,
  share,
  trend,
}: MakeCardProps) {
  const href = `/cars/makes/${slugify(make)}`;
  const hasStats = count !== undefined && share !== undefined;

  return (
    <Card
      isPressable
      as={Link}
      href={href}
      className="p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <CardBody>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-16 shrink-0 items-center justify-center">
              {logoUrl ? (
                <Image
                  alt={`${make} logo`}
                  src={logoUrl}
                  width={512}
                  height={512}
                  className="size-full object-contain"
                />
              ) : (
                <Avatar
                  name={make.charAt(0) || "?"}
                  classNames={{
                    base: "size-full bg-primary",
                    name: "text-lg font-semibold text-primary-foreground",
                  }}
                />
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <Typography.Label className="truncate">{make}</Typography.Label>
              {hasStats && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-xl tabular-nums leading-none">
                      {count.toLocaleString()}
                    </span>
                    <Typography.Caption>regs</Typography.Caption>
                  </div>
                  <Chip
                    color="primary"
                    variant="flat"
                    size="sm"
                    className="w-fit rounded-full"
                  >
                    {formatPercentage(share)} share
                  </Chip>
                </div>
              )}
            </div>
          </div>
          {trend && trend.length > 0 && (
            <Sparkline data={trend} height="h-10" />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
