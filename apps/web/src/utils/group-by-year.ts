import type { Month } from "@web/types";

export const groupByYear = (dates: Month[]) => {
  if (!dates) {
    return dates;
  }

  return dates.reduce((dates: Record<string, string[]>, date) => {
    const [year, month] = date.split("-");
    if (!dates[year]) {
      dates[year] = [];
    }
    dates[year].push(month);
    return dates;
  }, {});
};
