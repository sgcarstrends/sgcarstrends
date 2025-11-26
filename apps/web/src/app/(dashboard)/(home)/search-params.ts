import { createLoader, parseAsString } from "nuqs/server";

export const homeSearchParams = {
  year: parseAsString,
};

export const loadSearchParams = createLoader(homeSearchParams);
