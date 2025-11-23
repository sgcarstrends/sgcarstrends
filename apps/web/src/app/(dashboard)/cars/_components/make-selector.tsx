"use client";

import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { slugify } from "@sgcarstrends/utils";
import { LogoImage } from "@web/components/charts/logo-image";
import type { Make } from "@web/types";
import { useMemo } from "react";

type MakeSelectorProps = {
  makes: Make[];
  selectedMake: Make;
  logoUrlMap?: Record<string, string>;
};

type LogoProps = {
  make: Make;
  logoUrl?: string;
};

export const MakeSelector = ({
  makes,
  selectedMake,
  logoUrlMap = {},
}: MakeSelectorProps) => {
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
      startContent={
        <Logo make={selectedMake} logoUrl={logoUrlMap[slugify(selectedMake)]} />
      }
      variant="underlined"
    >
      {makes.map((make) => (
        <AutocompleteItem key={make} textValue={make}>
          <div className="flex items-center gap-2">
            <Logo make={make} logoUrl={logoUrlMap[slugify(make)]} />
            {make}
          </div>
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

const Logo = ({ make, logoUrl }: LogoProps) => {
  if (!logoUrl) return null;

  return (
    <LogoImage brand={make} logoUrl={logoUrl} size="sm" className="size-6" />
  );
};
