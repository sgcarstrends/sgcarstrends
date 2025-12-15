import { createLoader, parseAsString } from "nuqs/server";

export const searchParams = {
  make: parseAsString,
  month: parseAsString,
};

export const loadSearchParams = createLoader(searchParams);
