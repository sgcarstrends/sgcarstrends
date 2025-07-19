import { createLoader, parseAsString } from "nuqs/server";

export const vehicleSearchParams = { month: parseAsString };

export const loadSearchParams = createLoader(vehicleSearchParams);
