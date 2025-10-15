import { createLoader, parseAsString } from "nuqs/server";

export const makeSearchParams = { month: parseAsString };

export const loadSearchParams = createLoader(makeSearchParams);
