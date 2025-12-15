import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { slugify } from "@sgcarstrends/utils";
import { searchParams } from "@web/app/(dashboard)/cars/makes/search-params";
import Typography from "@web/components/typography";
import type { Make } from "@web/types";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createSerializer } from "nuqs/server";

const serialize = createSerializer(searchParams);

interface MakeCardProps {
  make: Make;
  isPopular?: boolean;
  logoUrl?: string;
}

export function MakeCard({ make, isPopular = false, logoUrl }: MakeCardProps) {
  const makeSlug = slugify(make);
  const href = serialize("/cars/makes", { make: makeSlug });

  return (
    <Card
      isPressable
      as={Link}
      href={href}
      className="hover:ring-2 hover:ring-primary-600"
    >
      <CardHeader>
        {isPopular && (
          <Chip color="primary" size="sm">
            <div className="flex items-center gap-1">
              <TrendingUp className="size-3" />
              <span>Popular</span>
            </div>
          </Chip>
        )}
      </CardHeader>
      <CardBody>
        {logoUrl ? (
          <Image
            alt={`${make} logo`}
            src={logoUrl}
            width={512}
            height={512}
            className="h-24 object-contain"
          />
        ) : (
          <div className="flex justify-center">
            <Avatar
              name={make}
              className="size-24 bg-primary text-2xl text-primary-foreground"
            />
          </div>
        )}
      </CardBody>
      <CardFooter>
        <Typography.Text>{make}</Typography.Text>
      </CardFooter>
    </Card>
  );
}
