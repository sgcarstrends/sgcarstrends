import type { Make } from "@web/types";
import { useMemo } from "react";

const getLetterFromMake = (make: Make) => {
  const firstChar = make.trim().charAt(0).toUpperCase();
  return firstChar >= "A" && firstChar <= "Z" ? firstChar : "#";
};

export const useGroupedMakes = (makes: Make[]) => {
  return useMemo(() => {
    const sortedMakes = [...makes].sort((a, b) => a.localeCompare(b));

    const grouped = sortedMakes.reduce<Record<string, Make[]>>((acc, make) => {
      const letter = getLetterFromMake(make);
      acc[letter] = acc[letter] ? [...acc[letter], make] : [make];
      return acc;
    }, {});

    const sortedLetters = Object.keys(grouped).sort((a, b) => {
      if (a === "#") return 1;
      if (b === "#") return -1;
      return a.localeCompare(b);
    });

    return {
      sortedMakes,
      groupedMakes: grouped,
      letters: ["ALL", ...sortedLetters],
    };
  }, [makes]);
};
