import { parseISO } from "date-fns";

export const getUniqueMonths = <
  T extends { [key in K]?: string },
  K extends string = "month",
>(
  data: T[],
  sortKey: K = "month" as K,
) =>
  [...new Set(data.map((item) => String(item[sortKey])))].sort((a, b) => {
    const monthA = parseISO(a);
    const monthB = parseISO(b);
    return monthA.getTime() - monthB.getTime();
  });
