"use client";

import { Autocomplete, AutocompleteItem } from "@heroui/react";
import Image from "next/image";
import { useMemo } from "react";
import type { Make } from "@web/types";
import slugify from "@sindresorhus/slugify";

type MakeSelectorProps = {
  makes: Make[];
  selectedMake: Make;
};

type LogoProps = {
  make: Make;
};

export const MakeSelector = ({ makes, selectedMake }: MakeSelectorProps) => {
  const validSelectedMake = useMemo(() => {
    const regexSelectedMake = selectedMake.replace(
      /[^a-zA-Z0-9]/g,
      "[^a-zA-Z0-9]*",
    );

    return makes.find((make) => new RegExp(regexSelectedMake, "i").test(make));
  }, [makes, selectedMake]);

  return (
    <Autocomplete
      selectedKey={validSelectedMake}
      onSelectionChange={(key) =>
        window.location.assign(slugify(key as string))
      }
      aria-label="Make"
      placeholder="Select Make"
      startContent={<Logo make={selectedMake} />}
      variant="underlined"
    >
      {makes.map((make) => (
        <AutocompleteItem key={make} textValue={make}>
          <div className="flex items-center gap-2">
            <Logo make={make} />
            {make}
          </div>
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

const Logo = ({ make }: LogoProps) => (
  <Image
    src={`https://assets.sgcarstrends.com/logos/${slugify(make)}.png`}
    alt={`${make} logo`}
    width={512}
    height={512}
    className="size-6"
  />
);
