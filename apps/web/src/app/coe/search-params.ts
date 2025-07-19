import { addYears, format } from "date-fns";
import { createLoader, parseAsString } from "nuqs/server";
import { getLatestMonth } from "@/utils/month-utils";

export const getDefaultEndDate = async (): Promise<string> => {
  return await getLatestMonth("coe");
};

export const getDefaultStartDate = async (): Promise<string> => {
  const latestMonth = await getLatestMonth("coe");
  const latestDate = new Date(latestMonth + "-01");
  return format(addYears(latestDate, -1), "yyyy-MM");
};

export const coeSearchParams = {
  start: parseAsString,
  end: parseAsString,
};

export const loadSearchParams = createLoader(coeSearchParams);
