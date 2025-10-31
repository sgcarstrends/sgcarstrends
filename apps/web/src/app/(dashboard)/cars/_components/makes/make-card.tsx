import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import slugify from "@sindresorhus/slugify";
import Typography from "@web/components/typography";
import type { Make } from "@web/types";
import { TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MakeCardProps {
  make: Make;
  isPopular?: boolean;
}

export const MakeCard = ({ make, isPopular = false }: MakeCardProps) => {
  const href = `/cars/makes/${slugify(make)}`;

  return (
    <Card
      as={Link}
      href={href}
      isPressable
      className="hover:ring-2 hover:ring-primary-600"
    >
      <CardHeader>
        {isPopular && (
          <Chip color="primary" size="sm" variant="solid">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              <span>Popular</span>
            </div>
          </Chip>
        )}
      </CardHeader>
      <CardBody>
        <Image
          alt={`${make} Logo`}
          src={`https://assets.sgcarstrends.com/logos/${slugify(make)}.png`}
          width={512}
          height={512}
          className="h-24 object-contain"
        />
      </CardBody>
      <CardFooter>
        <Typography.Text>{make}</Typography.Text>
      </CardFooter>
    </Card>
  );
};
