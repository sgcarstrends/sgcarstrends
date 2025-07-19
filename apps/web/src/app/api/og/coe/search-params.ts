import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const ogSearchParams = {
  title: parseAsString,
  subtitle: parseAsString,
  biddingNo: parseAsInteger.withDefault(1),
  categoryA: parseAsInteger,
  categoryB: parseAsInteger,
  categoryC: parseAsInteger,
  categoryD: parseAsInteger,
  categoryE: parseAsInteger,
};

export const loadSearchParams = createLoader(ogSearchParams);
