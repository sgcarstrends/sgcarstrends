import { Avatar } from "@heroui/avatar";
import { Card, CardBody } from "@heroui/card";
import { slugify } from "@sgcarstrends/utils";
import Typography from "@web/components/typography";
import type { Make } from "@web/types";
import Image from "next/image";
import Link from "next/link";

interface MakeCardProps {
  make: Make;
  logoUrl?: string;
}

export function MakeCard({ make, logoUrl }: MakeCardProps) {
  const href = `/cars/makes/${slugify(make)}`;

  return (
    <Card
      isPressable
      as={Link}
      href={href}
      className="hover:-translate-y-1 p-3 transition-all duration-300 hover:shadow-lg"
    >
      <CardBody>
        <div className="flex flex-col gap-2">
          <div className="flex size-16 items-center justify-center">
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
          <Typography.Label>{make}</Typography.Label>
        </div>
      </CardBody>
    </Card>
  );
}
