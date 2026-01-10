import { createLoader, parseAsString } from "nuqs/server";

export const carsSearchParams = {
  month: parseAsString,
};

export const loadSearchParams = createLoader(carsSearchParams);
