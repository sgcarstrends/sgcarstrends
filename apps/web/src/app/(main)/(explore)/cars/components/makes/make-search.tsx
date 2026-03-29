"use client";

import { ComboBox, Input, Label, ListBox } from "@heroui/react";
import { slugify } from "@sgcarstrends/utils";
import type { Make } from "@web/types";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Key } from "react";

interface MakeSearchProps {
  makes: Make[];
}

export function MakeSearch({ makes }: MakeSearchProps) {
  const router = useRouter();

  const handleSelectionChange = (key: Key | null) => {
    if (key) {
      router.push(`/cars/makes/${slugify(key as string)}`);
    }
  };

  return (
    <ComboBox onSelectionChange={handleSelectionChange}>
      <Label className="sr-only">Search make</Label>
      <ComboBox.InputGroup>
        <Search className="size-4 text-default-400" />
        <Input placeholder="Search make..." />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {makes.map((make) => (
            <ListBox.Item key={make} textValue={make}>
              {make}
            </ListBox.Item>
          ))}
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
}
