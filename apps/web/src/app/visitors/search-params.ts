import { createLoader, parseAsString } from "nuqs/server";

export const visitorsSearchParams = {
  start: parseAsString.withDefault(""),
  end: parseAsString.withDefault(""),
};

export const loadSearchParams = createLoader(visitorsSearchParams);
