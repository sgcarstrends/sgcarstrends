import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { slugify } from "@sgcarstrends/utils";
import { LogoImage } from "@web/components/charts/logo-image";
import Typography from "@web/components/typography";
import type { Make } from "@web/types";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

interface MakeCardProps {
  make: Make;
  isPopular?: boolean;
  logoUrl?: string;
}

export const MakeCard = ({
  make,
  isPopular = false,
  logoUrl,
}: MakeCardProps) => {
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
        <LogoImage brand={make} logoUrl={logoUrl} size="lg" />
      </CardBody>
      <CardFooter>
        <Typography.Text>{make}</Typography.Text>
      </CardFooter>
    </Card>
  );
};
