import { createLoader, parseAsString } from "nuqs/server";

export const typeSearchParams = { month: parseAsString };

export const loadSearchParams = createLoader(typeSearchParams);
