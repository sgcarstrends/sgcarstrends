"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "@/utils/slugify";
import type { Make } from "@/types";

interface Props {
  makes: Make[];
  selectedMake: Make;
}

export const MakeSelector = ({ makes, selectedMake }: Props) => {
  const router = useRouter();

  const validSelectedMake = useMemo(() => {
    const regexSelectedMake = selectedMake.replace(
      /[^a-zA-Z0-9]/g,
      "[^a-zA-Z0-9]*",
    );

    return makes.find((make) => new RegExp(regexSelectedMake, "i").test(make));
  }, [makes, selectedMake]);

  return (
    <div>
      <Select
        defaultValue={validSelectedMake}
        onValueChange={(make) => router.push(slugify(make))}
      >
        <SelectTrigger>
          <SelectValue placeholder="SELECT MAKE" />
        </SelectTrigger>
        <SelectContent>
          {makes.map((make) => (
            <SelectItem key={make} value={make}>
              {make}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
