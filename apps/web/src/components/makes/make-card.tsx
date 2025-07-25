"use client";

import { Button, Card, CardFooter, cn } from "@heroui/react";
import slugify from "@sindresorhus/slugify";
import { Car } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Make } from "@web/types";

interface MakeCardProps {
  make: Make;
  isPopular?: boolean;
  onMakePress?: (make: Make) => void;
}

export const MakeCard = ({
  make,
  isPopular = false,
  onMakePress,
}: MakeCardProps) => {
  const handlePress = () => {
    if (onMakePress) {
      onMakePress(make);
    }
  };

  return (
    <Card
      key={make}
      isFooterBlurred
      className={cn("h-32 border-none", {
        "ring-primary-600 ring-2": isPopular,
      })}
      radius="lg"
    >
      <div className="flex h-full w-full justify-center">
        <Image
          alt={`${make} Logo`}
          className="object-contain"
          src={`https://assets.sgcarstrends.com/logos/${slugify(make)}.png`}
          width={512}
          height={512}
        />
        <div className="fallback-icon bg-primary-100 hidden h-20 w-20 items-center justify-center rounded-lg">
          <Car className="text-primary-600 size-8" />
        </div>
      </div>
      <CardFooter className="rounded-large shadow-small absolute bottom-1 z-10 ml-1 w-[calc(100%_-_8px)] justify-between overflow-hidden border-1 border-white/20 py-1 backdrop-blur before:rounded-xl before:bg-black/50">
        <p className="text-tiny">{make}</p>
        <Button
          as={Link}
          href={`/cars/makes/${slugify(make)}`}
          color={isPopular ? "primary" : "default"}
          radius="lg"
          size="sm"
          variant="shadow"
          onPress={handlePress}
        >
          Explore
        </Button>
      </CardFooter>
    </Card>
  );
};
