"use client";

import { ComboBox, Input, Label, ListBox } from "@heroui/react";
import { slugify } from "@sgcarstrends/utils";
import type { Make } from "@web/types";
import Image from "next/image";
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

export function MakeSelector({
  makes,
  selectedMake,
  logoUrlMap = {},
}: MakeSelectorProps) {
  const validSelectedMake = useMemo(() => {
    const regexSelectedMake = selectedMake.replace(
      /[^a-zA-Z0-9]/g,
      "[^a-zA-Z0-9]*",
    );

    return makes.find((make) => new RegExp(regexSelectedMake, "i").test(make));
  }, [makes, selectedMake]);

  return (
    <ComboBox
      selectedKey={validSelectedMake}
      onSelectionChange={(key) =>
        window.location.assign(slugify(key as string))
      }
    >
      <Label className="sr-only">Make</Label>
      <ComboBox.InputGroup>
        <Logo make={selectedMake} logoUrl={logoUrlMap[slugify(selectedMake)]} />
        <Input placeholder="Select Make" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {makes.map((make) => (
            <ListBox.Item key={make} textValue={make}>
              <div className="flex items-center gap-2">
                <Logo make={make} logoUrl={logoUrlMap[slugify(make)]} />
                {make}
              </div>
            </ListBox.Item>
          ))}
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
}

function Logo({ make, logoUrl }: LogoProps) {
  if (!logoUrl) return null;

  return (
    <Image
      src={logoUrl}
      alt={`${make} logo`}
      width={512}
      height={512}
      className="size-6"
    />
  );
}
